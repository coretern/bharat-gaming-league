import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String keyBaseUrl = 'pref_base_url';
  static const String defaultProductionUrl = 'https://bharat-gaming-league.vercel.app';
  
  // Default fallbacks for local testing if production is toggled off
  static const String defaultAndroidLocalUrl = 'http://10.0.2.2:3000';
  static const String defaultIosLocalUrl = 'http://localhost:3000';

  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  String? _cachedBaseUrl;

  Future<String> get baseUrl async {
    if (_cachedBaseUrl != null) return _cachedBaseUrl!;
    final prefs = await SharedPreferences.getInstance();
    _cachedBaseUrl = prefs.getString(keyBaseUrl) ?? defaultProductionUrl;
    return _cachedBaseUrl!;
  }

  Future<void> setBaseUrl(String url) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(keyBaseUrl, url);
    _cachedBaseUrl = url;
  }

  Future<void> resetBaseUrl() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(keyBaseUrl);
    _cachedBaseUrl = defaultProductionUrl;
  }

  Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final email = prefs.getString('auth_email');
    final Map<String, String> headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (email != null && email.isNotEmpty) {
      headers['x-mobile-auth'] = 'BGL_MOBILE_SECRET_2026';
      headers['x-user-email'] = email;
    }
    return headers;
  }

  Future<http.Response> get(String path) async {
    final url = await baseUrl;
    final headers = await _getHeaders();
    return http.get(Uri.parse('$url$path'), headers: headers);
  }

  Future<http.Response> post(String path, dynamic body) async {
    final url = await baseUrl;
    final headers = await _getHeaders();
    return http.post(
      Uri.parse('$url$path'),
      headers: headers,
      body: body is String ? body : jsonEncode(body),
    );
  }

  Future<http.Response> put(String path, dynamic body) async {
    final url = await baseUrl;
    final headers = await _getHeaders();
    return http.put(
      Uri.parse('$url$path'),
      headers: headers,
      body: body is String ? body : jsonEncode(body),
    );
  }

  // Handle Multi-part request (for uploading QR codes/Screenshots)
  Future<http.StreamedResponse> multipart(
    String method,
    String path,
    Map<String, String> fields,
    List<http.MultipartFile> files,
  ) async {
    final url = await baseUrl;
    final headers = await _getHeaders();
    
    // Remove JSON content type for form data
    headers.remove('Content-Type');

    final request = http.MultipartRequest(method, Uri.parse('$url$path'));
    request.headers.addAll(headers);
    request.fields.addAll(fields);
    request.files.addAll(files);

    return request.send();
  }
}
