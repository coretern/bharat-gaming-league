import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final ApiService _apiService = ApiService();

  String? _currentUserEmail;
  String? _currentUserName;
  bool _isAuthenticated = false;

  String? get currentUserEmail => _currentUserEmail;
  String? get currentUserName => _currentUserName;
  bool get isAuthenticated => _isAuthenticated;

  Future<bool> checkSession() async {
    final prefs = await SharedPreferences.getInstance();
    final email = prefs.getString('auth_email');
    final name = prefs.getString('auth_name');
    if (email != null && email.isNotEmpty) {
      _currentUserEmail = email;
      _currentUserName = name;
      _isAuthenticated = true;
      return true;
    }
    _isAuthenticated = false;
    return false;
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _apiService.post('/api/mobile-auth/credentials', {
        'email': email,
        'password': password,
      });

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        final user = data['user'];
        final String userEmail = user['email'];
        final String userName = user['name'] ?? userEmail.split('@')[0];

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_email', userEmail);
        await prefs.setString('auth_name', userName);

        _currentUserEmail = userEmail;
        _currentUserName = userName;
        _isAuthenticated = true;

        return {'success': true};
      } else {
        return {'success': false, 'error': data['error'] ?? 'Login failed'};
      }
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  // Google Login session save (after deep link capture)
  Future<void> saveSocialSession(String email, String name) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_email', email);
    await prefs.setString('auth_name', name);

    _currentUserEmail = email;
    _currentUserName = name;
    _isAuthenticated = true;
  }

  Future<Map<String, dynamic>> registerInit(String email, String password, String phoneNumber) async {
    try {
      final response = await _apiService.post('/api/auth/signup/init', {
        'email': email,
        'password': password,
        'phoneNumber': phoneNumber,
      });

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'message': data['message']};
      } else {
        return {'success': false, 'error': data['error'] ?? 'Registration initiation failed'};
      }
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> registerVerify(String email, String otp) async {
    try {
      final response = await _apiService.post('/api/auth/signup/verify', {
        'email': email,
        'otp': otp,
      });

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'message': data['message']};
      } else {
        return {'success': false, 'error': data['error'] ?? 'Verification failed'};
      }
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_email');
    await prefs.remove('auth_name');
    _currentUserEmail = null;
    _currentUserName = null;
    _isAuthenticated = false;
  }
}
