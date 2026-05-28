import 'dart:convert';
import 'package:flutter/material';
import 'package:google_fonts/google_fonts.dart';
import '../../models/tournament.dart';
import '../../models/registration.dart'; // Imports Registration & PlayerRosterItem
import '../../models/user_profile.dart';
import '../../services/api_service.dart';
import 'payment_webview_screen.dart';

class TournamentRegisterScreen extends StatefulWidget {
  final Tournament tournament;
  final Registration? editRegistration; // Provided if resubmitting rejection

  const TournamentRegisterScreen({
    Key? key,
    required this.tournament,
    this.editRegistration,
  }) : super(key: key);

  @override
  State<TournamentRegisterScreen> createState() => _TournamentRegisterScreenState();
}

class _TournamentRegisterScreenState extends State<TournamentRegisterScreen> {
  final ApiService _apiService = ApiService();
  bool _isLoading = false;
  bool _isProfileLoading = true;
  String? _errorMessage;

  UserProfile? _profile;

  // Form Fields
  String _selectedMatchType = 'Solo';
  final _teamNameController = TextEditingController();
  final _whatsappController = TextEditingController();
  final _instagramController = TextEditingController();

  // Roster inputs
  final List<TextEditingController> _playerNames = List.generate(4, (_) => TextEditingController());
  final List<TextEditingController> _playerUids = List.generate(4, (_) => TextEditingController());
  final List<TextEditingController> _playerInstas = List.generate(4, (_) => TextEditingController());

  @override
  void initState() {
    super.initState();
    // Default match type to first allowed one
    if (widget.tournament.allowedMatchTypes.isNotEmpty) {
      _selectedMatchType = widget.tournament.allowedMatchTypes.first;
    }
    _loadProfileAndPrepopulate();
  }

  @override
  void dispose() {
    _teamNameController.dispose();
    _whatsappController.dispose();
    _instagramController.dispose();
    for (var c in _playerNames) {
      c.dispose();
    }
    for (var c in _playerUids) {
      c.dispose();
    }
    for (var c in _playerInstas) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _loadProfileAndPrepopulate() async {
    try {
      final response = await _apiService.get('/api/profile');
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        _profile = UserProfile.fromJson(data);
      }
    } catch (e) {
      // ignore profile load error, just continue
    }

    setState(() {
      _isProfileLoading = false;
    });

    if (widget.editRegistration != null) {
      // Edit/Resubmit Flow: Prepopulate from the rejected registration details
      final reg = widget.editRegistration!;
      setState(() {
        _selectedMatchType = reg.matchType;
        _teamNameController.text = reg.teamName;
        _whatsappController.text = reg.whatsapp;
        _instagramController.text = reg.instagram;

        for (int i = 0; i < 4; i++) {
          if (i < reg.players.length) {
            _playerNames[i].text = reg.players[i].name;
            _playerUids[i].text = reg.players[i].uid;
            _playerInstas[i].text = reg.players[i].instagram;
          }
        }
      });
    } else {
      // New Registration Flow: Prepopulate default details from active profile
      if (_profile != null) {
        setState(() {
          _teamNameController.text = _profile!.teamName;
          _whatsappController.text = _profile!.whatsapp;
          _instagramController.text = _profile!.instagram;

          // Default Player #1 (me) to profile credentials
          _playerNames[0].text = _profile!.name;
          _playerUids[0].text = _profile!.gameUID;
          _playerInstas[0].text = _profile!.instagram;
          
          // Auto-fill teammates from profile's saved players
          for (int i = 0; i < 3; i++) {
            if (i < _profile!.savedPlayers.length) {
              _playerNames[i + 1].text = _profile!.savedPlayers[i].name;
              _playerUids[i + 1].text = _profile!.savedPlayers[i].uid;
              _playerInstas[i + 1].text = _profile!.savedPlayers[i].instagram;
            }
          }
        });
      }
    }
  }

  // Helper to retrieve entry fees based on game and selected size
  double _getCalculatedEntryFee() {
    // Standard rates used by the site
    if (_selectedMatchType == 'Solo') return 36.0;
    if (_selectedMatchType == 'Duo') return 72.0;
    return 144.0; // Squad
  }

  Future<void> _submitRegistration() async {
    final teamName = _teamNameController.text.trim();
    final whatsapp = _whatsappController.text.trim();
    final instagram = _instagramController.text.trim();

    if (teamName.isEmpty || whatsapp.isEmpty) {
      setState(() => _errorMessage = 'Team name and WhatsApp are required');
      return;
    }

    // Verify phone is 10 digits
    final cleanPhone = whatsapp.replaceAll(RegExp(r'\D'), '');
    if (cleanPhone.length < 10) {
      setState(() => _errorMessage = 'Please provide a valid 10-digit WhatsApp number');
      return;
    }

    // Roster count verification
    final int requiredPlayers = _selectedMatchType == 'Solo'
        ? 1
        : _selectedMatchType == 'Duo'
            ? 2
            : 4;

    for (int i = 0; i < requiredPlayers; i++) {
      if (_playerNames[i].text.trim().isEmpty || _playerUids[i].text.trim().isEmpty) {
        setState(() => _errorMessage = 'Player name and Game UID are required for Player #${i + 1}');
        return;
      }
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final entryFee = _getCalculatedEntryFee();

      // Next.js registration POST expects formData parameters
      final Map<String, String> fields = {
        'matchType': _selectedMatchType,
        'teamName': teamName,
        'whatsapp': whatsapp,
        'instagram': instagram,
        'tournamentId': widget.tournament.id,
        'tournamentName': widget.tournament.title,
        'entryFee': '₹$entryFee',
      };

      if (widget.editRegistration != null) {
        fields['registrationId'] = widget.editRegistration!.id;
      }

      // Add squad members info
      for (int i = 0; i < requiredPlayers; i++) {
        fields['playerName_$i'] = _playerNames[i].text.trim();
        fields['playerUid_$i'] = _playerUids[i].text.trim();
        fields['playerInstagram_$i'] = _playerInstas[i].text.trim();
      }

      final String method = widget.editRegistration != null ? 'PUT' : 'POST';
      final response = await _apiService.multipart(method, '/api/register', fields, []);
      final responseBody = await response.stream.bytesToString();
      final data = jsonDecode(responseBody);

      if (response.statusCode == 200 && data['success'] == true) {
        final sessionId = data['paymentSessionId'];
        final orderId = data['orderId'];

        if (sessionId != null && sessionId.toString().isNotEmpty) {
          // Open Cashfree Checkout Webview
          final backendUrl = await _apiService.baseUrl;
          final checkoutUrl = '$backendUrl/api/payment/checkout?paymentSessionId=$sessionId';

          if (!mounted) return;

          final paymentResult = await Navigator.of(context).push<Map<String, String>>(
            MaterialPageRoute(
              builder: (_) => PaymentWebviewScreen(
                url: checkoutUrl,
                successRedirectUrl: 'order_id=',
                title: 'Secure Checkout',
              ),
            ),
          );

          if (paymentResult != null) {
            _verifyPayment(orderId);
          } else {
            // Cancelled
            if (mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Payment cancelled. Complete it from your registrations tab.')),
              );
              Navigator.of(context).pop();
            }
          }
        } else {
          // Free tournament registered successfully
          if (mounted) {
            _showSuccessDialog('Registration Successful!', 'You have registered for ${widget.tournament.title}. Check email confirmation.');
          }
        }
      } else {
        setState(() {
          _errorMessage = data['error'] ?? 'Registration failed';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Registration error: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _verifyPayment(String orderId) async {
    setState(() {
      _isLoading = true;
    });

    try {
      final response = await _apiService.get('/api/payment/verify?order_id=$orderId');
      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true && data['status'] == 'PAID') {
        if (mounted) {
          _showSuccessDialog('Payment Completed!', 'Roster submitted. Admins will verify your entry fee payment shortly.');
        }
      } else {
        setState(() {
          _errorMessage = 'Payment verification pending. Complete it from your registrations tab.';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Connection lost during payment check: $e';
        _isLoading = false;
      });
    }
  }

  void _showSuccessDialog(String title, String message) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: const Color(0xFF1E293B),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 56),
                const SizedBox(height: 16),
                Text(
                  title,
                  style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const SizedBox(height: 8),
                Text(
                  message,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(fontSize: 12.5, color: const Color(0xFF94A3B8)),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 44,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).pop(); // dismiss dialog
                      Navigator.of(context).pop(); // pop register screen
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1A73E8)),
                    child: const Text('GO TO DASHBOARD', style: TextStyle(color: Colors.white)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isProfileLoading) {
      return const Scaffold(
        backgroundColor: Color(0xFF0B0F19),
        body: Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF1A73E8)),
          ),
        ),
      );
    }

    final double fee = _getCalculatedEntryFee();
    final int requiredPlayers = _selectedMatchType == 'Solo'
        ? 1
        : _selectedMatchType == 'Duo'
            ? 2
            : 4;

    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        title: Text(
          widget.editRegistration != null ? 'Edit Registration' : 'Register Tournament',
          style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Tournament Info header
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF1E293B)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.sports_esports, color: Color(0xFF1A73E8), size: 36),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.tournament.title,
                            style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${widget.tournament.game} • Prize Pool: ${widget.tournament.prizePool}',
                            style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF64748B), fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Error display
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
                          style: GoogleFonts.inter(color: const Color(0xFFFCA5A5), fontSize: 12.5, fontWeight: FontWeight.w500),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
              ],

              // Match details inputs
              Text(
                'REGISTRATION SETTINGS',
                style: GoogleFonts.outfit(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  color: const Color(0xFF64748B),
                  letterSpacing: 1.0,
                ),
              ),
              const SizedBox(height: 12),

              // Match type selector dropdown
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF1E293B)),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedMatchType,
                    dropdownColor: const Color(0xFF0F172A),
                    icon: const Icon(Icons.arrow_drop_down, color: Color(0xFF64748B)),
                    style: const TextStyle(color: Colors.white, fontSize: 13.5),
                    onChanged: (String? val) {
                      if (val != null) {
                        setState(() {
                          _selectedMatchType = val;
                        });
                      }
                    },
                    items: widget.tournament.allowedMatchTypes.map<DropdownMenuItem<String>>((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Text('$value Match'),
                      );
                    }).toList(),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              _buildInput(_teamNameController, 'Team Name', Icons.groups_outlined),
              _buildInput(_whatsappController, 'WhatsApp Number (10 digits)', Icons.phone_outlined, keyboardType: TextInputType.phone),
              _buildInput(_instagramController, 'Team Instagram Username (Optional)', Icons.alternate_email_outlined),

              const SizedBox(height: 24),

              // Roster details
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  Text(
                    'ROSTER SELECTION ($requiredPlayers PLAYERS)',
                    style: GoogleFonts.outfit(
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      color: const Color(0xFF64748B),
                      letterSpacing: 1.0,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              for (int i = 0; i < requiredPlayers; i++) ...[
                _buildPlayerForm(i),
                const SizedBox(height: 16),
              ],

              const SizedBox(height: 24),

              // Entry Fee Summary
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF1A73E8).withOpacity(0.05),
                  border: Border.all(color: const Color(0xFF1A73E8).withOpacity(0.15)),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'TOTAL ENTRY FEE',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFF1A73E8),
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'INR rate for $_selectedMatchType matches',
                          style: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    Text(
                      '₹${fee.toStringAsFixed(0)}',
                      style: GoogleFonts.outfit(
                        fontSize: 22,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submitRegistration,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1A73E8),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : Text(
                          fee > 0 ? 'PAY & SUBMIT ROSTER' : 'SUBMIT FREE REGISTRATION',
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
        ),
      ),
    );
  }

  Widget _buildInput(
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

  Widget _buildPlayerForm(int idx) {
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
            idx == 0 ? 'Player #1 (Leader / You)' : 'Player #${idx + 1}',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF1A73E8),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _playerNames[idx],
                  style: const TextStyle(color: Colors.white, fontSize: 12.5),
                  decoration: _getPlayerFieldDecoration('Full Name'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: TextField(
                  controller: _playerUids[idx],
                  style: const TextStyle(color: Colors.white, fontSize: 12.5),
                  decoration: _getPlayerFieldDecoration('Character UID'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _playerInstas[idx],
            style: const TextStyle(color: Colors.white, fontSize: 12.5),
            decoration: _getPlayerFieldDecoration('Instagram (Optional)'),
          ),
        ],
      ),
    );
  }

  InputDecoration _getPlayerFieldDecoration(String label) {
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
