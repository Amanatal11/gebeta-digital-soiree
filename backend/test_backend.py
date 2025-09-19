#!/usr/bin/env python3
"""
Simple test script for the Gebeta hint backend
"""
import requests
import json

def test_backend():
    base_url = "http://localhost:8000"
    
    # Test health endpoint
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure it's running on localhost:8000")
        return False
    
    # Test suggest-move endpoint
    print("\nTesting suggest-move endpoint...")
    test_data = {
        "board": [
            [4, 4, 4, 4, 4, 4],  # Player 0's row
            [4, 4, 4, 4, 4, 4]   # Player 1's row
        ],
        "currentPlayer": 0,
        "variant": "12-hole",
        "stores": [0, 0]
    }
    
    try:
        response = requests.post(
            f"{base_url}/suggest-move",
            headers={"Content-Type": "application/json"},
            data=json.dumps(test_data)
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Move suggestion successful")
            print(f"Suggested hole: {result['suggestedHole']}")
            print(f"Confidence: {result['confidence']}")
            print(f"Reasoning: {result['reasoning']}")
        else:
            print(f"❌ Move suggestion failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing suggest-move: {e}")
        return False
    
    print("\n🎉 All tests passed! Backend is working correctly.")
    return True

if __name__ == "__main__":
    test_backend()
