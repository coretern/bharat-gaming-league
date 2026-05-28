import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/api_service.dart';

class WalletTab extends StatefulWidget {
  const WalletTab({Key? key}) : super(key: key);

  @override
  State<WalletTab> createState() => _WalletTabState();
}

class _WalletTabState extends State<WalletTab> {
  final ApiService _apiService = ApiService();
  bool _isLoading = true;
  String? _errorMessage;

  double _totalSpend = 0.0;
  double _totalEarning = 0.0;
  double _netPosition = 0.0;
  List<dynamic> _history = [];

  @override
  void initState() {
    super.initState();
    _fetchWalletData();
  }

  Future<void> _fetchWalletData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await _apiService.get('/api/withdrawal');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          double parseDouble(dynamic val) {
            if (val == null) return 0.0;
            if (val is num) return val.toDouble();
            return double.tryParse(val.toString()) ?? 0.0;
          }

          setState(() {
            _totalSpend = parseDouble(data['totalSpend']);
            _totalEarning = parseDouble(data['totalEarning']);
            _netPosition = _totalEarning - _totalSpend;
            _history = data['history'] ?? [];
            _isLoading = false;
          });
        } else {
          setState(() {
            _errorMessage = data['error'] ?? 'Failed to parse financial data';
            _isLoading = false;
          });
        }
      } else {
        setState(() {
          _errorMessage = 'Server error (${response.statusCode})';
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

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
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
              const Icon(Icons.warning_amber_outlined, color: Color(0xFFEF4444), size: 48),
              const SizedBox(height: 16),
              Text(
                'Failed to load financial records',
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
                onPressed: _fetchWalletData,
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1A73E8)),
                child: const Text('RETRY', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _fetchWalletData,
      color: const Color(0xFF1A73E8),
      backgroundColor: const Color(0xFF0F172A),
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Metrics cards grid
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(
                    title: 'Total Spend',
                    amount: _totalSpend,
                    icon: Icons.arrow_downward,
                    iconColor: const Color(0xFFEF4444),
                    desc: 'Entry fees paid',
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMetricCard(
                    title: 'Total Earning',
                    amount: _totalEarning,
                    icon: Icons.arrow_upward,
                    iconColor: const Color(0xFF10B981),
                    desc: 'Prizes won',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _buildNetCard(),
            const SizedBox(height: 24),

            // Financial Payout Linking Info Box
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.05),
                border: Border.all(color: const Color(0xFF10B981).withOpacity(0.15)),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.info_outline, color: Color(0xFF10B981), size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'PAYOUT ACCOUNT RULES',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            color: const Color(0xFF10B981),
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Prizes are verified by league admins and dispatched directly to your linked PhonePe/GPay QR code (linked in your Profile). Ensure your profile contains a valid payment QR.',
                          style: GoogleFonts.inter(
                            fontSize: 11.5,
                            color: const Color(0xFF94A3B8),
                            height: 1.4,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // History Label
            Text(
              'TRANSACTION HISTORY',
              style: GoogleFonts.outfit(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                color: const Color(0xFF64748B),
                letterSpacing: 1.0,
              ),
            ),
            const SizedBox(height: 12),

            // History List
            if (_history.isEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 40),
                alignment: Alignment.center,
                child: Text(
                  'No transactions recorded yet.',
                  style: GoogleFonts.inter(color: const Color(0xFF475569), fontSize: 13),
                ),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _history.length,
                itemBuilder: (context, index) {
                  final item = _history[index];
                  final double spend = (item['spend'] ?? 0).toDouble();
                  final double earning = (item['earning'] ?? 0).toDouble();
                  final isWon = item['resultStatus'] == 'Won';

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFF1E293B)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Left detail: Tournament title & Type
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item['tournamentName'] ?? 'Tournament',
                                style: GoogleFonts.inter(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${item['matchType']} • ${item['teamName']}',
                                style: GoogleFonts.inter(
                                  fontSize: 11,
                                  color: const Color(0xFF475569),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Right detail: Earning or Spend indicators
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            if (earning > 0)
                              Text(
                                '+₹${earning.toStringAsFixed(0)}',
                                style: GoogleFonts.inter(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w900,
                                  color: const Color(0xFF10B981),
                                ),
                              )
                            else if (spend > 0)
                              Text(
                                '-₹${spend.toStringAsFixed(0)}',
                                style: GoogleFonts.inter(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w900,
                                  color: const Color(0xFFEF4444),
                                ),
                              )
                            else
                              Text(
                                '₹0',
                                style: GoogleFonts.inter(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w900,
                                  color: const Color(0xFF64748B),
                                ),
                              ),
                            const SizedBox(height: 4),
                            Text(
                              isWon ? 'WON PRIZE' : 'ENTRY FEE',
                              style: GoogleFonts.inter(
                                fontSize: 8.5,
                                fontWeight: FontWeight.w900,
                                color: isWon ? const Color(0xFF10B981) : const Color(0xFF64748B),
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required double amount,
    required IconData icon,
    required Color iconColor,
    required String desc,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title.toUpperCase(),
                style: GoogleFonts.inter(
                  fontSize: 9.5,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF64748B),
                  letterSpacing: 0.5,
                ),
              ),
              Icon(icon, size: 14, color: iconColor),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            '₹${amount.toStringAsFixed(0)}',
            style: GoogleFonts.outfit(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            desc,
            style: GoogleFonts.inter(
              fontSize: 10,
              color: const Color(0xFF475569),
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNetCard() {
    final bool isPositive = _netPosition >= 0;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'NET POSITION',
                style: GoogleFonts.inter(
                  fontSize: 9.5,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF64748B),
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '${isPositive ? '' : '-'}₹${_netPosition.abs().toStringAsFixed(0)}',
                style: GoogleFonts.outfit(
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                  color: isPositive ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Overall Balance Sheet',
                style: GoogleFonts.inter(
                  fontSize: 10,
                  color: const Color(0xFF475569),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: (isPositive ? const Color(0xFF10B981) : const Color(0xFFEF4444)).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.account_balance_wallet,
              color: isPositive ? const Color(0xFF10B981) : const Color(0xFFEF4444),
              size: 20,
            ),
          ),
        ],
      ),
    );
  }
}
