import 'dart:convert';
import 'package:flutter/material';
import 'package:google_fonts/google_fonts.dart';
import '../../models/user_profile.dart';
import '../../models/registration.dart'; // Imports PlayerRosterItem
import '../../services/api_service.dart';

class ProfileTab extends StatefulWidget {
  const ProfileTab({Key? key}) : super(key: key);

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  final ApiService _apiService = ApiService();
  bool _isLoading = true;
  bool _isSaving = false;
  String? _message;
  String? _errorMessage;

  UserProfile? _profile;

  // Controllers
  final _nameController = TextEditingController();
  final _teamNameController = TextEditingController();
  final _gameUsernameController = TextEditingController();
  final _gameUIDController = TextEditingController();
  final _whatsappController = TextEditingController();
  final _instagramController = TextEditingController();

  // Saved players controllers (maximum 4)
  final List<TextEditingController> _playerNameControllers = List.generate(4, (_) => TextEditingController());
  final List<TextEditingController> _playerUidControllers = List.generate(4, (_) => TextEditingController());
  final List<TextEditingController> _playerInstaControllers = List.generate(4, (_) => TextEditingController());

  @override
  void initState() {
    super.initState();
    _fetchProfile();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _teamNameController.dispose();
    _gameUsernameController.dispose();
    _gameUIDController.dispose();
    _whatsappController.dispose();
    _instagramController.dispose();
    for (var c in _playerNameControllers) {
      c.dispose();
    }
    for (var c in _playerUidControllers) {
      c.dispose();
    }
    for (var c in _playerInstaControllers) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _fetchProfile() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await _apiService.get('/api/profile');
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        final profile = UserProfile.fromJson(data);

        setState(() {
          _profile = profile;
          _isLoading = false;

          // Populate fields
          _nameController.text = profile.name;
          _teamNameController.text = profile.teamName;
          _gameUsernameController.text = profile.gameUsername;
          _gameUIDController.text = profile.gameUID;
          _whatsappController.text = profile.whatsapp;
          _instagramController.text = profile.instagram;

          // Populate saved players (up to 4)
          for (int i = 0; i < 4; i++) {
            if (i < profile.savedPlayers.length) {
              _playerNameControllers[i].text = profile.savedPlayers[i].name;
              _playerUidControllers[i].text = profile.savedPlayers[i].uid;
              _playerInstaControllers[i].text = profile.savedPlayers[i].instagram;
            } else {
              _playerNameControllers[i].clear();
              _playerUidControllers[i].clear();
              _playerInstaControllers[i].clear();
            }
          }
        });
      } else {
        setState(() {
          _errorMessage = 'Failed to load profile (${response.statusCode})';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Connection error: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _saveProfile() async {
    setState(() {
      _isSaving = true;
      _message = null;
      _errorMessage = null;
    });

    try {
      // Build saved players list
      List<Map<String, String>> savedPlayers = [];
      for (int i = 0; i < 4; i++) {
        final name = _playerNameControllers[i].text.trim();
        final uid = _playerUidControllers[i].text.trim();
        final insta = _playerInstaControllers[i].text.trim();

        if (name.isNotEmpty || uid.isNotEmpty) {
          savedPlayers.add({
            'name': name,
            'uid': uid,
            'instagram': insta,
          });
        }
      }

      // We make a PUT request using multi-part or standard JSON depending on QR upload
      // Since we don't have native picker plugin, we save profile details as standard API body fields
      // Next.js PUT route parses formData, so we will make a multi-part request without files
      final fields = {
        'name': _nameController.text.trim(),
        'teamName': _teamNameController.text.trim(),
        'gameUsername': _gameUsernameController.text.trim(),
        'gameUID': _gameUIDController.text.trim(),
        'whatsapp': _whatsappController.text.trim(),
        'instagram': _instagramController.text.trim(),
        'savedPlayers': jsonEncode(savedPlayers),
      };

      final response = await _apiService.multipart('PUT', '/api/profile', fields, []);
      final responseBody = await response.stream.bytesToString();
      final data = jsonDecode(responseBody);

      setState(() {
        _isSaving = false;
      });

      if (response.statusCode == 200) {
        setState(() {
          _message = 'Profile updated successfully!';
        });
        _fetchProfile(); // reload profile
      } else {
        setState(() {
          _errorMessage = data['error'] ?? 'Profile update failed';
        });
      }
    } catch (e) {
      setState(() {
        _isSaving = false;
        _errorMessage = 'Error saving profile: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF1A73E8)),
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Banner Message
          if (_message != null) ...[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.1),
                border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.check_circle_outline, color: Color(0xFF10B981), size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      _message!,
                      style: GoogleFonts.inter(color: const Color(0xFFA7F3D0), fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],

          if (_errorMessage != null) ...[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFFEF4444).withOpacity(0.1),
                border: Border.all(color: const Color(0xFFEF4444).withOpacity(0.3)),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.error_outline, color: Color(0xFFEF4444), size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      _errorMessage!,
                      style: GoogleFonts.inter(color: const Color(0xFFFCA5A5), fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],

          // Card: Account info
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: const Color(0xFF1A73E8),
                  backgroundImage: _profile?.image.isNotEmpty == true ? NetworkImage(_profile!.image) : null,
                  child: _profile?.image.isEmpty == true
                      ? const Icon(Icons.person, color: Colors.white, size: 28)
                      : null,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _profile?.name.isNotEmpty == true ? _profile!.name : 'BGL Gamer',
                        style: GoogleFonts.outfit(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _profile?.email ?? '',
                        style: GoogleFonts.inter(
                          fontSize: 12.5,
                          color: const Color(0xFF64748B),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Section 1: Profile Details
          Text(
            'GAMING PROFILE DETAILS',
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.w900,
              color: const Color(0xFF64748B),
              letterSpacing: 1.0,
            ),
          ),
          const SizedBox(height: 12),

          _buildTextField(_nameController, 'Display Name', Icons.person_outline),
          _buildTextField(_teamNameController, 'Default Team Name', Icons.groups_outlined),
          _buildTextField(_gameUsernameController, 'In-game Username', Icons.videogame_asset_outlined),
          _buildTextField(_gameUIDController, 'In-game character UID', Icons.fingerprint_outlined),
          _buildTextField(_whatsappController, 'WhatsApp Number', Icons.phone_outlined, keyboardType: TextInputType.phone),
          _buildTextField(_instagramController, 'Instagram Username', Icons.alternate_email_outlined),

          const SizedBox(height: 24),

          // Payout QR indicator
          Text(
            'PAYOUT QR LINK',
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.w900,
              color: const Color(0xFF64748B),
              letterSpacing: 1.0,
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (_profile?.paymentQrUrl.isNotEmpty == true) ...[
                  Row(
                    children: [
                      Container(
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color(0xFF334155)),
                        ),
                        child: Image.network(_profile!.paymentQrUrl, fit: BoxFit.cover),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Payout QR Configured',
                              style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'QR code image linked to account.',
                              style: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ] else ...[
                  Row(
                    children: [
                      const Icon(Icons.qr_code_scanner, color: Color(0xFFF59E0B), size: 36),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'No Payout QR Uploaded',
                              style: TextStyle(color: Color(0xFFF59E0B), fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Upload your payment QR on the website to collect cash prize payouts.',
                              style: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: 11.5),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 28),

          // Section 2: Saved Teammates
          Text(
            'SAVED TEAM SQUAD (MAX 4)',
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.w900,
              color: const Color(0xFF64748B),
              letterSpacing: 1.0,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Save teammate details to quickly fill rosters when registering for tournaments.',
            style: GoogleFonts.inter(fontSize: 11.5, color: const Color(0xFF475569), fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),

          for (int i = 0; i < 4; i++) ...[
            _buildPlayerSection(i),
            const SizedBox(height: 16),
          ],

          const SizedBox(height: 32),

          // Save Button
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: _isSaving ? null : _saveProfile,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1A73E8),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
              ),
              child: _isSaving
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : Text(
                      'SAVE PROFILE SETTINGS',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: 1.0,
                      ),
                    ),
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildTextField(
    TextEditingController controller,
    String label,
    IconData icon, {
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Container(
      margin: const EdgeInsets.bottom(16),
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        style: const TextStyle(color: Colors.white, fontSize: 13.5),
        decoration: InputDecoration(
          labelText: label,
          labelStyle: GoogleFonts.inter(color: const Color(0xFF475569), fontSize: 12),
          prefixIcon: Icon(icon, color: const Color(0xFF475569), size: 18),
          filled: true,
          fillColor: const Color(0xFF0F172A),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF1E293B)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF1A73E8), width: 1.5),
          ),
        ),
      ),
    );
  }

  Widget _buildPlayerSection(int idx) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Teammate #${idx + 1}',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF1A73E8),
            ),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _playerNameControllers[idx],
                  style: const TextStyle(color: Colors.white, fontSize: 12.5),
                  decoration: _getPlayerInputDecoration('Name'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: TextField(
                  controller: _playerUidControllers[idx],
                  style: const TextStyle(color: Colors.white, fontSize: 12.5),
                  decoration: _getPlayerInputDecoration('Character UID'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _playerInstaControllers[idx],
            style: const TextStyle(color: Colors.white, fontSize: 12.5),
            decoration: _getPlayerInputDecoration('Instagram Username'),
          ),
        ],
      ),
    );
  }

  InputDecoration _getPlayerInputDecoration(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Color(0xFF475569), fontSize: 11),
      isDense: true,
      contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: Color(0xFF1E293B)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: Color(0xFF1A73E8)),
      ),
    );
  }
}
