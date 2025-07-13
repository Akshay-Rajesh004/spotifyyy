#!/usr/bin/env python3
"""
Backend API Testing Script for Spotify Integration
Tests all critical endpoints and authentication flows
"""

import requests
import json
import sys
from urllib.parse import urlparse, parse_qs

# Backend URL from frontend .env
BACKEND_URL = "http://localhost:8001"

class SpotifyBackendTester:
    def __init__(self):
        self.backend_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
        print()
    
    def test_health_check(self):
        """Test the health check endpoint"""
        try:
            response = self.session.get(f"{self.backend_url}/api/health")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test(
                        "Health Check", 
                        True, 
                        "Health endpoint returns healthy status",
                        {"status_code": response.status_code, "response": data}
                    )
                else:
                    self.log_test(
                        "Health Check", 
                        False, 
                        f"Unexpected health status: {data.get('status')}",
                        {"status_code": response.status_code, "response": data}
                    )
            else:
                self.log_test(
                    "Health Check", 
                    False, 
                    f"Health check failed with status {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
        except Exception as e:
            self.log_test(
                "Health Check", 
                False, 
                f"Health check request failed: {str(e)}"
            )
    
    def test_cors_headers(self):
        """Test CORS headers are properly set"""
        try:
            response = self.session.get(f"{self.backend_url}/api/health")
            cors_headers = {
                "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin"),
                "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods"),
                "Access-Control-Allow-Headers": response.headers.get("Access-Control-Allow-Headers"),
                "Access-Control-Allow-Credentials": response.headers.get("Access-Control-Allow-Credentials")
            }
            
            has_cors = any(cors_headers.values())
            
            self.log_test(
                "CORS Headers", 
                has_cors, 
                "CORS headers present" if has_cors else "CORS headers missing",
                {"cors_headers": cors_headers}
            )
        except Exception as e:
            self.log_test(
                "CORS Headers", 
                False, 
                f"CORS test failed: {str(e)}"
            )
    
    def test_spotify_login_url(self):
        """Test Spotify login URL generation"""
        try:
            response = self.session.get(f"{self.backend_url}/api/auth/login")
            
            if response.status_code == 200:
                data = response.json()
                auth_url = data.get("auth_url")
                
                if auth_url and "accounts.spotify.com" in auth_url:
                    # Parse URL to validate parameters
                    parsed_url = urlparse(auth_url)
                    query_params = parse_qs(parsed_url.query)
                    
                    required_params = ["client_id", "response_type", "redirect_uri", "scope"]
                    missing_params = [param for param in required_params if param not in query_params]
                    
                    if not missing_params:
                        self.log_test(
                            "Spotify Login URL", 
                            True, 
                            "Valid Spotify OAuth URL generated",
                            {
                                "auth_url": auth_url,
                                "client_id": query_params.get("client_id", [""])[0],
                                "redirect_uri": query_params.get("redirect_uri", [""])[0],
                                "scope": query_params.get("scope", [""])[0]
                            }
                        )
                    else:
                        self.log_test(
                            "Spotify Login URL", 
                            False, 
                            f"Missing required OAuth parameters: {missing_params}",
                            {"auth_url": auth_url, "missing_params": missing_params}
                        )
                else:
                    self.log_test(
                        "Spotify Login URL", 
                        False, 
                        "Invalid or missing auth_url in response",
                        {"response": data}
                    )
            else:
                self.log_test(
                    "Spotify Login URL", 
                    False, 
                    f"Login URL generation failed with status {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
        except Exception as e:
            self.log_test(
                "Spotify Login URL", 
                False, 
                f"Login URL test failed: {str(e)}"
            )
    
    def test_protected_endpoint_without_token(self, endpoint, method="GET", data=None):
        """Test that protected endpoints return 401 without valid token"""
        try:
            if method == "GET":
                response = self.session.get(f"{self.backend_url}{endpoint}")
            elif method == "POST":
                response = self.session.post(f"{self.backend_url}{endpoint}", json=data or {})
            
            if response.status_code == 401:
                self.log_test(
                    f"Auth Protection - {endpoint}", 
                    True, 
                    "Correctly returns 401 without valid token",
                    {"status_code": response.status_code, "endpoint": endpoint}
                )
            else:
                self.log_test(
                    f"Auth Protection - {endpoint}", 
                    False, 
                    f"Expected 401 but got {response.status_code}",
                    {"status_code": response.status_code, "response": response.text, "endpoint": endpoint}
                )
        except Exception as e:
            self.log_test(
                f"Auth Protection - {endpoint}", 
                False, 
                f"Auth protection test failed: {str(e)}"
            )
    
    def test_protected_endpoint_with_invalid_token(self, endpoint, method="GET", data=None):
        """Test that protected endpoints return 401 with invalid token"""
        try:
            headers = {"Authorization": "Bearer invalid_token_12345"}
            
            if method == "GET":
                response = self.session.get(f"{self.backend_url}{endpoint}", headers=headers)
            elif method == "POST":
                response = self.session.post(f"{self.backend_url}{endpoint}", json=data or {}, headers=headers)
            
            if response.status_code == 401:
                self.log_test(
                    f"Invalid Token - {endpoint}", 
                    True, 
                    "Correctly returns 401 with invalid token",
                    {"status_code": response.status_code, "endpoint": endpoint}
                )
            else:
                self.log_test(
                    f"Invalid Token - {endpoint}", 
                    False, 
                    f"Expected 401 but got {response.status_code}",
                    {"status_code": response.status_code, "response": response.text, "endpoint": endpoint}
                )
        except Exception as e:
            self.log_test(
                f"Invalid Token - {endpoint}", 
                False, 
                f"Invalid token test failed: {str(e)}"
            )
    
    def test_backend_connectivity(self):
        """Test basic backend connectivity"""
        try:
            response = self.session.get(f"{self.backend_url}/")
            
            if response.status_code == 200:
                data = response.json()
                if "Spotify Clone API" in data.get("message", ""):
                    self.log_test(
                        "Backend Connectivity", 
                        True, 
                        "Backend is running and responding",
                        {"status_code": response.status_code, "response": data}
                    )
                else:
                    self.log_test(
                        "Backend Connectivity", 
                        False, 
                        "Backend responding but unexpected message",
                        {"status_code": response.status_code, "response": data}
                    )
            else:
                self.log_test(
                    "Backend Connectivity", 
                    False, 
                    f"Backend not responding properly: {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
        except Exception as e:
            self.log_test(
                "Backend Connectivity", 
                False, 
                f"Cannot connect to backend: {str(e)}"
            )
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Spotify Backend Integration Tests")
        print(f"Testing backend at: {self.backend_url}")
        print("=" * 60)
        
        # Basic connectivity
        self.test_backend_connectivity()
        
        # Health check
        self.test_health_check()
        
        # CORS headers
        self.test_cors_headers()
        
        # Spotify OAuth
        self.test_spotify_login_url()
        
        # Protected endpoints without token
        protected_endpoints = [
            ("/api/user/profile", "GET"),
            ("/api/search?q=test", "GET"),
            ("/api/play", "POST", {"track_uri": "spotify:track:test"}),
            ("/api/pause", "POST"),
            ("/api/devices", "GET"),
            ("/api/playback/state", "GET")
        ]
        
        for endpoint_info in protected_endpoints:
            endpoint = endpoint_info[0]
            method = endpoint_info[1]
            data = endpoint_info[2] if len(endpoint_info) > 2 else None
            
            self.test_protected_endpoint_without_token(endpoint, method, data)
            self.test_protected_endpoint_with_invalid_token(endpoint, method, data)
        
        # Summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n✅ CRITICAL ENDPOINTS STATUS:")
        critical_endpoints = [
            "Backend Connectivity",
            "Health Check", 
            "Spotify Login URL",
            "Auth Protection - /api/user/profile",
            "Auth Protection - /api/search?q=test"
        ]
        
        for endpoint in critical_endpoints:
            result = next((r for r in self.test_results if r["test"] == endpoint), None)
            if result:
                status = "✅" if result["success"] else "❌"
                print(f"  {status} {endpoint}")
        
        return passed_tests, failed_tests

if __name__ == "__main__":
    tester = SpotifyBackendTester()
    tester.run_all_tests()
    
    # Exit with error code if tests failed
    passed, failed = tester.print_summary()
    sys.exit(0 if failed == 0 else 1)