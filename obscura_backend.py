#!/usr/bin/env python3
"""
Obscura Vault - Pure Backend (No GUI) with Session Management
Fixed to maintain session state between separate Python process calls
"""

import json
import os
import sys
import secrets
import string  # noqa: F401
import base64
import hashlib  # noqa: F401
import tempfile
import time
from datetime import datetime
from pathlib import Path  # noqa: F401

# Crypto imports
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import argon2

class ObscuraCrypto:
    """🔐 OBSCURA CRYPTO ENGINE - Pure Backend"""
    
    def __init__(self):
        self.backend = default_backend()
        self.password_hasher = argon2.PasswordHasher(
            time_cost=3, memory_cost=65536, parallelism=1, hash_len=32, salt_len=16
        )
        
    def generate_salt(self, length: int = 32) -> bytes:
        return secrets.token_bytes(length)
    
    def derive_key(self, password: str, salt: bytes, iterations: int = 100000) -> bytes:
        password_bytes = password.encode('utf-8')
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(), length=32, salt=salt,
            iterations=iterations, backend=self.backend
        )
        return kdf.derive(password_bytes)
    
    def hash_password(self, password: str) -> str:
        return self.password_hasher.hash(password)
    
    def verify_password(self, password: str, hashed: str) -> bool:
        try:
            self.password_hasher.verify(hashed, password)
            return True
        except argon2.exceptions.VerifyMismatchError:
            return False
    
    def encrypt_data(self, data: str, password: str) -> dict:
        plaintext = data.encode('utf-8')
        salt = self.generate_salt(32)
        nonce = self.generate_salt(12)
        key = self.derive_key(password, salt)
        
        cipher = Cipher(algorithms.AES(key), modes.GCM(nonce), backend=self.backend)
        encryptor = cipher.encryptor()
        ciphertext = encryptor.update(plaintext) + encryptor.finalize()
        auth_tag = encryptor.tag
        
        key = b'\x00' * len(key)  # Clear key from memory
        
        return {
            'version': '1.0',
            'algorithm': 'AES-256-GCM',
            'salt': base64.b64encode(salt).decode('utf-8'),
            'nonce': base64.b64encode(nonce).decode('utf-8'),
            'auth_tag': base64.b64encode(auth_tag).decode('utf-8'),
            'ciphertext': base64.b64encode(ciphertext).decode('utf-8'),
            'timestamp': datetime.now().isoformat()
        }
    
    def decrypt_data(self, encrypted_package: dict, password: str) -> str:
        salt = base64.b64decode(encrypted_package['salt'])
        nonce = base64.b64decode(encrypted_package['nonce'])
        auth_tag = base64.b64decode(encrypted_package['auth_tag'])
        ciphertext = base64.b64decode(encrypted_package['ciphertext'])
        
        key = self.derive_key(password, salt)
        cipher = Cipher(algorithms.AES(key), modes.GCM(nonce, auth_tag), backend=self.backend)
        decryptor = cipher.decryptor()
        
        try:
            plaintext = decryptor.update(ciphertext) + decryptor.finalize()
            key = b'\x00' * len(key)  # Clear key from memory
            return plaintext.decode('utf-8')
        except Exception as e:
            key = b'\x00' * len(key)  # Clear key from memory
            raise Exception("🚨 DECRYPTION FAILED - Invalid password or corrupted data")
    



class ObscuraVaultManager:
    """🔐 VAULT MANAGER - With Session Persistence"""
    
    def __init__(self, data_dir=".obscura"):
        self.data_dir = data_dir
        self.config_path = os.path.join(data_dir, "config.json")
        self.vault_path = os.path.join(data_dir, "vault.enc")
        self.session_path = os.path.join(data_dir, "session.json")
        self.crypto = ObscuraCrypto()
        self.is_unlocked = False
        self._current_password = None
        self.master_password_hash = None
        
        # Create vault directory if it doesn't exist
        os.makedirs(data_dir, exist_ok=True)
        
        # Load session state first
        self._load_session()
        
        # Load config if it exists
        if os.path.exists(self.config_path):
            self._load_config()
    
    def _load_session(self):
        """Load session state from temporary file"""
        try:
            if os.path.exists(self.session_path):
                with open(self.session_path, 'r') as f:
                    session_data = json.load(f)
                
                # Check if session is still valid (within 30 minutes)
                session_time = session_data.get('timestamp', 0)
                current_time = time.time()
                
                if current_time - session_time < 1800:  # 30 minutes
                    self.is_unlocked = session_data.get('unlocked', False)
                    self._current_password = session_data.get('password')
                else:
                    # Session expired, clear it
                    self._clear_session()
        except Exception:
            # If session file is corrupted, just ignore it
            self._clear_session()
    
    def _save_session(self):
        """Save session state to temporary file"""
        try:
            session_data = {
                'unlocked': self.is_unlocked,
                'password': self._current_password if self.is_unlocked else None,
                'timestamp': time.time()
            }
            with open(self.session_path, 'w') as f:
                json.dump(session_data, f)
        except Exception:
            # If we can't save session, that's okay - just continue
            pass
    
    def _clear_session(self):
        """Clear session state"""
        try:
            if os.path.exists(self.session_path):
                os.remove(self.session_path)
        except Exception:
            pass
        self.is_unlocked = False
        self._current_password = None
    
    def _load_config(self):
        if os.path.exists(self.config_path):
            try:
                with open(self.config_path, 'r') as f:
                    config = json.load(f)
                    self.master_password_hash = config.get('master_password_hash')
            except Exception:
                pass
    
    def _save_config(self):
        config = {
            'created': datetime.now().isoformat(),
            'master_password_hash': self.master_password_hash,
            'version': '2.0'
        }
        with open(self.config_path, 'w') as f:
            json.dump(config, f, indent=2)
    
    def is_vault_initialized(self) -> bool:
        return self.master_password_hash is not None
    
    def initialize_vault(self, master_password: str) -> bool:
        if self.is_vault_initialized():
            return False
        
        try:
            self.master_password_hash = self.crypto.hash_password(master_password)
            
            empty_vault = {
                'entries': [],
                'metadata': {
                    'created': datetime.now().isoformat(),
                    'version': '2.0',
                    'total_entries': 0
                }
            }
            
            encrypted_vault = self.crypto.encrypt_data(
                json.dumps(empty_vault, indent=2), master_password
            )
            
            with open(self.vault_path, 'w') as f:
                json.dump(encrypted_vault, f, indent=2)
            
            self._save_config()
            self.is_unlocked = True
            self._current_password = master_password
            self._save_session()  # Save session after initialization
            return True
        except Exception:
            return False
    
    def unlock_vault(self, master_password: str) -> bool:
        if not self.is_vault_initialized():
            return False
        
        if not self.crypto.verify_password(master_password, self.master_password_hash):
            return False
        
        try:
            # Test if we can decrypt the vault with this password
            with open(self.vault_path, 'r') as f:
                encrypted_vault = json.load(f)
            
            self.crypto.decrypt_data(encrypted_vault, master_password)
            self.is_unlocked = True
            self._current_password = master_password
            self._save_session()  # Save session after successful unlock
            return True
        except Exception:
            return False
    
    def lock_vault(self):
        self.is_unlocked = False
        if hasattr(self, '_current_password'):
            self._current_password = '\x00' * len(self._current_password)
            delattr(self, '_current_password')
        self._clear_session()  # Clear session when locking
    
    def _load_vault_data(self) -> dict:
        if not self.is_unlocked:
            raise Exception("Vault is locked!")
        
        with open(self.vault_path, 'r') as f:
            encrypted_vault = json.load(f)
        
        decrypted_data = self.crypto.decrypt_data(encrypted_vault, self._current_password)
        return json.loads(decrypted_data)
    
    def _save_vault_data(self, vault_data: dict):
        if not self.is_unlocked:
            raise Exception("Vault is locked!")
        
        vault_data['metadata']['modified'] = datetime.now().isoformat()
        vault_data['metadata']['total_entries'] = len(vault_data['entries'])
        
        encrypted_vault = self.crypto.encrypt_data(
            json.dumps(vault_data, indent=2), self._current_password
        )
        
        with open(self.vault_path, 'w') as f:
            json.dump(encrypted_vault, f, indent=2)
        
        # Update session timestamp to keep it alive
        self._save_session()
    
    def add_entry(self, name: str, entry_type: str, data: dict, category: str = "Other", description: str = "") -> bool:
        try:
            vault_data = self._load_vault_data()
            
            # Check for duplicate names
            for existing_entry in vault_data['entries']:
                if existing_entry['name'].lower() == name.lower():
                    return False
            
            new_entry = {
                'id': secrets.token_hex(8),
                'name': name,
                'type': entry_type,
                'data': data,
                'category': category,
                'description': description,
                'created': datetime.now().isoformat(),
                'last_used': 'Never',
                'usage_count': 0
            }
            
            vault_data['entries'].append(new_entry)
            self._save_vault_data(vault_data)
            return True
        except Exception:
            return False
    
    def list_entries(self) -> list:
        try:
            vault_data = self._load_vault_data()
            return vault_data.get('entries', [])
        except Exception:
            return []
    
    def get_entry_data(self, entry_id: str, field: str = None) -> str:
        try:
            vault_data = self._load_vault_data()
            
            for entry in vault_data['entries']:
                if entry['id'] == entry_id:
                    # Update usage stats
                    entry['last_used'] = datetime.now().strftime("%Y-%m-%d %H:%M")
                    entry['usage_count'] += 1
                    self._save_vault_data(vault_data)
                    
                    if field:
                        return entry['data'].get(field, '')
                    else:
                        return json.dumps(entry['data'])
            
            return None
        except Exception:
            return None
    
    def update_entry(self, entry_id: str, name: str, entry_type: str, data: dict, category: str, description: str) -> bool:
        try:
            vault_data = self._load_vault_data()
            
            for entry in vault_data['entries']:
                if entry['id'] == entry_id:
                    entry['name'] = name
                    entry['type'] = entry_type
                    entry['data'] = data
                    entry['category'] = category
                    entry['description'] = description
                    entry['modified'] = datetime.now().isoformat()
                    
                    self._save_vault_data(vault_data)
                    return True
            
            return False
        except Exception:
            return False
    
    def delete_entry(self, entry_id: str) -> bool:
        try:
            vault_data = self._load_vault_data()
            
            original_length = len(vault_data['entries'])
            vault_data['entries'] = [e for e in vault_data['entries'] if e['id'] != entry_id]
            
            if len(vault_data['entries']) < original_length:
                self._save_vault_data(vault_data)
                return True
            
            return False
        except Exception:
            return False


class ObscuraCLI:
    """🔐 COMMAND LINE INTERFACE"""
    
    def __init__(self, data_dir=".obscura"):
        self.vault_manager = ObscuraVaultManager(data_dir)
    
    def check_vault(self):
        """Check if vault exists and is initialized"""
        try:
            return {
                "success": True,
                "initialized": self.vault_manager.is_vault_initialized()
            }
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def initialize_vault(self, master_password):
        """Initialize a new vault with master password"""
        try:
            if self.vault_manager.is_vault_initialized():
                return {"success": False, "error": "Vault already initialized"}
            
            result = self.vault_manager.initialize_vault(master_password)
            if result:
                return {"success": True, "message": "Vault initialized successfully"}
            else:
                return {"success": False, "error": "Failed to initialize vault"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def unlock_vault(self, master_password):
        """Unlock vault with master password"""
        try:
            if not self.vault_manager.is_vault_initialized():
                return {"success": False, "error": "Vault not initialized"}
            
            result = self.vault_manager.unlock_vault(master_password)
            if result:
                return {"success": True, "message": "Vault unlocked successfully"}
            else:
                return {"success": False, "error": "Invalid master password"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def lock_vault(self):
        """Lock the vault"""
        try:
            self.vault_manager.lock_vault()
            return {"success": True, "message": "Vault locked successfully"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def list_entries(self):
        """List all vault entries"""
        try:
            if not self.vault_manager.is_unlocked:
                return {"success": False, "error": "Vault is locked"}
            
            entries = self.vault_manager.list_entries()
            
            # Convert entries to serializable format (with data for display)
            serializable_entries = []
            for entry in entries:
                serializable_entry = {
                    'id': entry['id'],
                    'name': entry['name'],
                    'type': entry['type'],
                    'category': entry['category'],
                    'description': entry['description'],
                    'created': entry['created'],
                    'last_used': entry['last_used'],
                    'usage_count': entry['usage_count'],
                    'data': entry.get('data', {})  # Include data for frontend display
                }
                serializable_entries.append(serializable_entry)
            
            return {"success": True, "data": serializable_entries}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def add_entry(self, name, entry_type, data_json, category, description):
        """Add a new entry to the vault"""
        try:
            if not self.vault_manager.is_unlocked:
                return {"success": False, "error": "Vault is locked"}
            
            # Parse the data JSON
            try:
                data = json.loads(data_json)
            except json.JSONDecodeError:
                return {"success": False, "error": "Invalid data format"}
            
            result = self.vault_manager.add_entry(name, entry_type, data, category, description)
            if result:
                return {"success": True, "message": "Entry added successfully"}
            else:
                return {"success": False, "error": "Failed to add entry (name might already exist)"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def get_entry_data(self, entry_id, field=None):
        """Get decrypted data from an entry"""
        try:
            if not self.vault_manager.is_unlocked:
                return {"success": False, "error": "Vault is locked"}
            
            data = self.vault_manager.get_entry_data(entry_id, field)
            if data is not None:
                return data  # Return the decrypted data directly
            else:
                return {"success": False, "error": "Entry not found"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def update_entry(self, entry_id, name, entry_type, data_json, category, description):
        """Update an existing entry"""
        try:
            if not self.vault_manager.is_unlocked:
                return {"success": False, "error": "Vault is locked"}
            
            # Parse the data JSON
            try:
                data = json.loads(data_json)
            except json.JSONDecodeError:
                return {"success": False, "error": "Invalid data format"}
            
            result = self.vault_manager.update_entry(entry_id, name, entry_type, data, category, description)
            if result:
                return {"success": True, "message": "Entry updated successfully"}
            else:
                return {"success": False, "error": "Entry not found"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def delete_entry(self, entry_id):
        """Delete an entry from the vault"""
        try:
            if not self.vault_manager.is_unlocked:
                return {"success": False, "error": "Vault is locked"}
            
            result = self.vault_manager.delete_entry(entry_id)
            if result:
                return {"success": True, "message": "Entry deleted successfully"}
            else:
                return {"success": False, "error": "Entry not found"}
        except Exception as e:
            return {"success": False, "error": str(e)}


def main():
    """Main CLI entry point"""
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"success": False, "error": "No command provided"}))
            sys.exit(1)
        
        command = sys.argv[1]
        cli = ObscuraCLI()
        
        if command == "check":
            result = cli.check_vault()
        elif command == "init":
            if len(sys.argv) < 3:
                result = {"success": False, "error": "Master password required"}
            else:
                result = cli.initialize_vault(sys.argv[2])
        elif command == "unlock":
            if len(sys.argv) < 3:
                result = {"success": False, "error": "Master password required"}
            else:
                result = cli.unlock_vault(sys.argv[2])
        elif command == "lock":
            result = cli.lock_vault()
        elif command == "list":
            result = cli.list_entries()
        elif command == "add":
            if len(sys.argv) < 7:
                result = {"success": False, "error": "Insufficient arguments for add command"}
            else:
                result = cli.add_entry(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6])
        elif command == "get":
            if len(sys.argv) < 3:
                result = {"success": False, "error": "Entry ID required"}
            else:
                field = sys.argv[3] if len(sys.argv) > 3 else None
                result = cli.get_entry_data(sys.argv[2], field)
        elif command == "update":
            if len(sys.argv) < 8:
                result = {"success": False, "error": "Insufficient arguments for update command"}
            else:
                result = cli.update_entry(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6], sys.argv[7])
        elif command == "delete":
            if len(sys.argv) < 3:
                result = {"success": False, "error": "Entry ID required"}
            else:
                result = cli.delete_entry(sys.argv[2])
        else:
            result = {"success": False, "error": f"Unknown command: {command}"}
        
        # Output result as JSON
        if isinstance(result, dict):
            print(json.dumps(result))
        else:
            print(result)  # For direct data returns like get_entry_data
            
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Unexpected error: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()