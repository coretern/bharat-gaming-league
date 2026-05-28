import 'dart:convert';
import 'package:flutter/material';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../models/registration.dart';
import '../../services/api_service.dart';
import '../payment_webview_screen.dart';
import '../tournament_register_screen.dart';
import '../../models/tournament.dart';

class MyRegistrationsTab extends StatefulWidget {
  const MyRegistrationsTab({Key? key}) : super(key: key);

  @override
  State<MyRegistrationsTab> createState() => _MyRegistrationsTabState();
}

class _MyRegistrationsTabState extends State<MyRegistrationsTab> {
  final ApiService _apiService = ApiService();
  List<Registration> _registrations = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchRegistrations();
  }

  Future<void> _fetchRegistrations() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await _apiService.get('/api/my-registrations');
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        setState(() {
          _registrations = data.map((json) => Registration.fromJson(json)).toList();
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = 'Failed to load registrations (${response.statusCode})';
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

  void _copyToClipboard(String text, String label) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$label copied to clipboard!'),
        backgroundColor: const Color(0xFF10B981),
      ),
    );
  }

  Future<void> _handleRepay(Registration reg) async {
    setState(() {
      _isLoading = true;
    });

    try {
      final response = await _apiService.post('/api/payment/repay?id=${reg.id}', {});
      final data = jsonDecode(response.body);

      setState(() {
        _isLoading = false;
      });

      if (response.statusCode == 200 && data['success'] == true) {
        final sessionId = data['paymentSessionId'];
        final orderId = data['orderId'];
        final backendUrl = await _apiService.baseUrl;
        final checkoutUrl = '$backendUrl/api/payment/checkout?paymentSessionId=$sessionId';

        if (!mounted) return;

        final paymentResult = await Navigator.of(context).push<Map<String, String>>(
          MaterialPageRoute(
            builder: (_) => PaymentWebviewScreen(
              url: checkoutUrl,
              successRedirectUrl: 'order_id=',
              title: 'Complete Payment',
            ),
          ),
        );

        if (paymentResult != null) {
          _verifyPayment(orderId);
        } else {
          _fetchRegistrations();
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(data['error'] ?? 'Repayment failed')),
          );
        }
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error initiating repayment: $e')),
        );
      }
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
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Payment completed successfully!'),
              backgroundColor: Color(0xFF10B981),
            ),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Payment verification pending or failed. status: ${data['status'] ?? 'UNKNOWN'}'),
              backgroundColor: const Color(0xFFEF4444),
            ),
          );
        }
      }
    } catch (e) {
      // ignore error
    } finally {
      _fetchRegistrations();
    }
  }

  void _viewReceipt(Registration reg) async {
    final backendUrl = await _apiService.baseUrl;
    final receiptUrl = '$backendUrl/api/receipt?id=${reg.id}';

    if (!mounted) return;

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => PaymentWebviewScreen(
          url: receiptUrl,
          successRedirectUrl: '__NEVER_REDIRECT__',
          title: 'Payment Receipt',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading && _registrations.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF1A73E8)),
        ),
      );
    }

    if (_errorMessage != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, color: Color(0xFFEF4444), size: 48),
              const SizedBox(height: 16),
              Text(
                'Failed to load registrations',
                style: GoogleFonts.outfit(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                _errorMessage!,
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: 13),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _fetchRegistrations,
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1A73E8)),
                child: const Text('RETRY', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        ),
      );
    }

    if (_registrations.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.assignment_turned_in_outlined, color: Colors.white.withOpacity(0.15), size: 64),
            const SizedBox(height: 16),
            Text(
              'No registrations yet',
              style: GoogleFonts.outfit(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            Text(
              'Your registered tournaments will appear here.',
              style: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: 13),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _fetchRegistrations,
      color: const Color(0xFF1A73E8),
      backgroundColor: const Color(0xFF0F172A),
      child: ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemCount: _registrations.length,
        itemBuilder: (context, index) {
          final reg = _registrations[index];

          Color statusColor;
          IconData statusIcon;
          if (reg.status == 'Approved') {
            statusColor = const Color(0xFF10B981);
            statusIcon = Icons.check_circle_outline;
          } else if (reg.status == 'Rejected') {
            statusColor = const Color(0xFFEF4444);
            statusIcon = Icons.cancel_outlined;
          } else {
            statusColor = const Color(0xFFF59E0B);
            statusIcon = Icons.hourglass_empty;
          }

          final isPaid = reg.paymentVerified || reg.paymentStatus == 'Paid';
          final needsPayment = !isPaid && reg.entryFee > 0;

          return Container(
            margin: const EdgeInsets.bottom(16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: reg.status == 'Approved'
                    ? const Color(0xFF10B981).withOpacity(0.2)
                    : const Color(0xFF1E293B),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Header: Tournament Name + Game Badge
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            reg.tournamentName,
                            style: GoogleFonts.outfit(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Team: ${reg.teamName} (${reg.matchType})',
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: const Color(0xFF94A3B8),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        reg.game,
                        style: GoogleFonts.inter(
                          fontSize: 9,
                          fontWeight: FontWeight.w900,
                          color: const Color(0xFF1A73E8),
                        ),
                      ),
                    ),
                  ],
                ),
                const Divider(color: Color(0xFF1E293B), height: 24),

                // Group & Slot Details
                Row(
                  children: [
                    _buildRegDetail('GROUP', 'G${reg.groupNumber > 0 ? reg.groupNumber : '—'}'),
                    _buildRegDetail('SLOT', 'S${reg.slotNumber > 0 ? reg.slotNumber : '—'}'),
                    _buildRegDetail('DATE', reg.matchDate.isNotEmpty ? reg.matchDate : 'Awaiting Schedule'),
                    _buildRegDetail('TIME', reg.matchTime.isNotEmpty ? reg.matchTime : '—'),
                  ],
                ),
                const SizedBox(height: 16),

                // Status Row: Roster approval + Payment state
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Row(
                      children: [
                        Icon(statusIcon, color: statusColor, size: 16),
                        const SizedBox(width: 6),
                        Text(
                          reg.status.toUpperCase(),
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: statusColor,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: isPaid ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          isPaid ? 'PAID' : (reg.entryFee > 0 ? 'UNPAID' : 'FREE'),
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: isPaid ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                // Approved Room Credentials Box
                if (reg.status == 'Approved' && reg.roomId.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1A73E8).withOpacity(0.08),
                      border: Border.all(color: const Color(0xFF1A73E8).withOpacity(0.2)),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.vpn_key_outlined, color: Color(0xFF1A73E8), size: 16),
                            const SizedBox(width: 8),
                            Text(
                              'MATCH ROOM DETAILS',
                              style: GoogleFonts.inter(
                                fontSize: 10,
                                fontWeight: FontWeight.black,
                                color: const Color(0xFF1A73E8),
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            Text(
                              'Room ID: ${reg.roomId}',
                              style: GoogleFonts.inter(
                                fontSize: 12.5,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.copy, size: 16, color: Color(0xFF94A3B8)),
                              padding: EdgeInsets.zero,
                              constraints: const BoxConstraints(),
                              onPressed: () => _copyToClipboard(reg.roomId, 'Room ID'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            Text(
                              'Password: ${reg.roomPassword}',
                              style: GoogleFonts.inter(
                                fontSize: 12.5,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.copy, size: 16, color: Color(0xFF94A3B8)),
                              padding: EdgeInsets.zero,
                              constraints: const BoxConstraints(),
                              onPressed: () => _copyToClipboard(reg.roomPassword, 'Password'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],

                // Rejected Details Box & Resubmit Button
                if (reg.status == 'Rejected') ...[
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: const Color(0xFFEF4444).withOpacity(0.08),
                      border: Border.all(color: const Color(0xFFEF4444).withOpacity(0.2)),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'REJECTION REASON:',
                          style: GoogleFonts.inter(
                            fontSize: 9,
                            fontWeight: FontWeight.black,
                            color: const Color(0xFFEF4444),
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          reg.rejectionReason.isNotEmpty ? reg.rejectionReason : 'Details rejected by admin review.',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: const Color(0xFFFCA5A5),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    height: 38,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.edit_note, size: 18, color: Colors.white),
                      label: Text(
                        'EDIT & RESUBMIT',
                        style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5, color: Colors.white),
                      ),
                      onPressed: () {
                        // Prepopulate the registration form
                        final tempTourney = Tournament(
                          id: reg.tournamentId,
                          title: reg.tournamentName,
                          game: reg.game,
                          prizePool: '',
                          date: reg.matchDate,
                          time: reg.matchTime,
                          slots: '',
                          image: '',
                          status: 'Open',
                          allowedMatchTypes: [reg.matchType],
                        );
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => TournamentRegisterScreen(
                              tournament: tempTourney,
                              editRegistration: reg,
                            ),
                          ),
                        ).then((_) => _fetchRegistrations());
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1E293B),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                          side: const BorderSide(color: Color(0xFFEF4444), width: 1.0),
                        ),
                      ),
                    ),
                  ),
                ],

                // Action Buttons Row (Receipt & Complete Payment)
                if (isPaid || needsPayment) ...[
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      if (isPaid)
                        Expanded(
                          child: SizedBox(
                            height: 38,
                            child: OutlinedButton.icon(
                              icon: const Icon(Icons.receipt_long, size: 16, color: Color(0xFF94A3B8)),
                              label: Text(
                                'VIEW RECEIPT',
                                style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFF94A3B8)),
                              ),
                              onPressed: () => _viewReceipt(reg),
                              style: OutlinedButton.styleFrom(
                                side: const BorderSide(color: Color(0xFF334155)),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                            ),
                          ),
                        ),
                      if (needsPayment) ...[
                        if (isPaid) const SizedBox(width: 12),
                        Expanded(
                          child: SizedBox(
                            height: 38,
                            child: ElevatedButton.icon(
                              icon: const Icon(Icons.payment, size: 16, color: Colors.white),
                              label: Text(
                                'COMPLETE PAYMENT',
                                style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                              ),
                              onPressed: () => _handleRepay(reg),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF1A73E8),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildRegDetail(String label, String value) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 8.5,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF475569),
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
