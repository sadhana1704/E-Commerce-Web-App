import urllib.request
import urllib.error
import json
import sys

BASE_URL = 'http://127.0.0.1:5000/api'

def make_request(endpoint, method='GET', data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    
    body = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            return response.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        res_body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(res_body)
        except Exception:
            return e.code, {'error': res_body}

def run_tests():
    print("==================================================")
    print("   STARTING AUTOMATED FULL-STACK API TEST SUITE   ")
    print("==================================================")

    passed_count = 0
    total_tests = 0

    def assert_test(name, condition, details=""):
        nonlocal passed_count, total_tests
        total_tests += 1
        if condition:
            passed_count += 1
            print(f"  [PASS] {name}")
        else:
            print(f"  [FAIL] {name} - {details}")

    # 1. Health Check
    status, body = make_request('/health')
    assert_test("API Health Check", status == 200 and body.get('status') == 'healthy', f"Got {status}: {body}")

    # 2. Get Products Listing
    status, body = make_request('/products')
    assert_test("Get Products List", status == 200 and body.get('count', 0) > 0, f"Got {status}: {body}")

    # 3. Product Categories
    status, body = make_request('/products/categories')
    categories = [c['name'] for c in body.get('categories', [])]
    assert_test("Get Categories", status == 200 and 'Electronics' in categories, f"Got {categories}")

    # 4. Search Products
    status, body = make_request('/products?search=Sony')
    assert_test("Search Products for 'Sony'", status == 200 and body.get('count', 0) >= 1)

    # 5. Filter by Category
    status, body = make_request('/products?category=Electronics')
    assert_test("Filter by Category 'Electronics'", status == 200 and all(p['category'] == 'Electronics' for p in body.get('products', [])))

    # 6. User Login (Demo user)
    status, body = make_request('/auth/login', method='POST', data={'email': 'user@ecommerce.com', 'password': 'user123'})
    user_token = body.get('token')
    user_id = body.get('user', {}).get('id')
    assert_test("Demo User Login", status == 200 and user_token is not None, f"Got {status}: {body}")

    # 7. Get Current User Me Profile
    status, body = make_request('/auth/me', token=user_token)
    assert_test("Auth /me Endpoint", status == 200 and body.get('user', {}).get('email') == 'user@ecommerce.com')

    # 8. User Registration
    test_user_email = f"test_{urllib.request.random.randint(1000, 9999)}@example.com" if hasattr(urllib.request, 'random') else "test_newuser_99@example.com"
    status, body = make_request('/auth/register', method='POST', data={
        'name': 'Test Shopper',
        'email': test_user_email,
        'password': 'password123',
        'role': 'user'
    })
    new_user_token = body.get('token')
    assert_test("New User Registration", status == 201 and new_user_token is not None, f"Got {status}: {body}")

    # 9. Get Single Product
    status, body = make_request('/products/1')
    assert_test("Get Product Details by ID", status == 200 and 'product' in body and body['product']['id'] == 1)
    initial_stock = body.get('product', {}).get('stock', 0)

    # 10. Place Order as Registered User
    status, body = make_request('/orders', method='POST', data={
        'shipping_name': 'Test Shopper',
        'shipping_email': test_user_email,
        'shipping_phone': '+1 (555) 987-6543',
        'shipping_address': '100 Silicon Way',
        'shipping_city': 'San Jose',
        'shipping_state': 'California',
        'shipping_pincode': '95113',
        'items': [{'product_id': 1, 'quantity': 1}]
    }, token=new_user_token)
    created_order_id = body.get('order', {}).get('id')
    assert_test("Place Demo Order", status == 201 and created_order_id is not None, f"Got {status}: {body}")

    # 11. Verify Stock Decremented
    status, body = make_request('/products/1')
    new_stock = body.get('product', {}).get('stock', 0)
    assert_test("Stock Decrement after Order", new_stock == initial_stock - 1, f"Expected {initial_stock - 1}, got {new_stock}")

    # 12. User Order History
    status, body = make_request('/orders', token=new_user_token)
    user_orders = body.get('orders', [])
    assert_test("User Order History", status == 200 and len(user_orders) == 1 and user_orders[0]['id'] == created_order_id)

    # 13. Security: User cannot view another user's order
    status, body = make_request(f'/orders/{created_order_id}', token=user_token)
    assert_test("Security: User Isolated Orders (Forbidden)", status == 403, f"Expected 403, got {status}")

    # 14. Admin Login
    status, body = make_request('/auth/login', method='POST', data={'email': 'admin@ecommerce.com', 'password': 'admin123'})
    admin_token = body.get('token')
    assert_test("Admin Login", status == 200 and body.get('user', {}).get('role') == 'admin')

    # 15. Admin Stats
    status, body = make_request('/admin/stats', token=admin_token)
    assert_test("Admin Dashboard Stats", status == 200 and body.get('total_orders', 0) >= 1 and 'total_revenue' in body)

    # 16. Admin Order Status Update
    status, body = make_request(f'/admin/orders/{created_order_id}/status', method='PUT', data={'status': 'Shipped'}, token=admin_token)
    assert_test("Admin Update Order Status", status == 200 and body.get('order', {}).get('status') == 'Shipped')

    # 17. Admin Product Creation
    status, body = make_request('/products', method='POST', data={
        'name': 'Test Mechanical Numpad',
        'description': 'Custom CNC aluminum mechanical numpad with RGB',
        'category': 'Electronics',
        'price': 49.99,
        'stock': 20,
        'rating': 4.9,
        'image_url': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'
    }, token=admin_token)
    new_product_id = body.get('product', {}).get('id')
    assert_test("Admin Create Product", status == 201 and new_product_id is not None)

    # 18. Admin Product Update
    status, body = make_request(f'/products/{new_product_id}', method='PUT', data={'price': 39.99, 'stock': 25}, token=admin_token)
    assert_test("Admin Update Product", status == 200 and body.get('product', {}).get('price') == 39.99 and body.get('product', {}).get('stock') == 25)

    # 19. Admin Product Deletion
    status, body = make_request(f'/products/{new_product_id}', method='DELETE', token=admin_token)
    assert_test("Admin Delete Product", status == 200)

    # 20. Security: Regular User Blocked from Admin Endpoints
    status, body = make_request('/admin/stats', token=user_token)
    assert_test("Security: Non-Admin Blocked from Admin Stats (403)", status == 403)

    status, body = make_request('/products', method='POST', data={'name': 'Hack', 'category': 'Electronics', 'price': 1}, token=user_token)
    assert_test("Security: Non-Admin Blocked from Product Creation (403)", status == 403)

    # 21. Security: Unauthenticated Blocked from Orders
    status, body = make_request('/orders')
    assert_test("Security: Unauthenticated Blocked (401)", status == 401)

    print("==================================================")
    print(f"   TEST SUITE SUMMARY: {passed_count}/{total_tests} TESTS PASSED")
    print("==================================================")

    if passed_count == total_tests:
        print("ALL TESTS PASSED WITH 100% SUCCESS!")
        return 0
    else:
        print("SOME TESTS FAILED.")
        return 1

if __name__ == '__main__':
    sys.exit(run_tests())
