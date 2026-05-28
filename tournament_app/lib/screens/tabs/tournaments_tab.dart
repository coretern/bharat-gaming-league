import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/tournament.dart';
import '../../services/api_service.dart';
import '../tournament_register_screen.dart';

class TournamentsTab extends StatefulWidget {
  const TournamentsTab({Key? key}) : super(key: key);

  @override
  State<TournamentsTab> createState() => _TournamentsTabState();
}

class _TournamentsTabState extends State<TournamentsTab> {
  final ApiService _apiService = ApiService();
  List<Tournament> _tournaments = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchTournaments();
  }

  Future<void> _fetchTournaments() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await _apiService.get('/api/tournaments');
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        setState(() {
          _tournaments = data.map((json) => Tournament.fromJson(json)).toList();
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = 'Failed to load tournaments (${response.statusCode})';
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

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Open':
        return const Color(0xFF10B981);
      case 'Closed':
        return const Color(0xFFEF4444);
      case 'Coming Soon':
        return const Color(0xFFF59E0B);
      default:
        return Colors.grey;
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
              const Icon(Icons.wifi_off, color: Color(0xFFEF4444), size: 48),
              const SizedBox(height: 16),
              Text(
                'Something went wrong',
                style: GoogleFonts.outfit(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                _errorMessage!,
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: 13),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _fetchTournaments,
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1A73E8)),
                child: const Text('RETRY', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        ),
      );
    }

    if (_tournaments.isEmpty) {
      return Center(
        child: Text(
          'No active tournaments found.',
          style: GoogleFonts.inter(color: const Color(0xFF64748B)),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _fetchTournaments,
      color: const Color(0xFF1A73E8),
      backgroundColor: const Color(0xFF0F172A),
      child: ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemCount: _tournaments.length,
        itemBuilder: (context, index) {
          final tournament = _tournaments[index];
          final isOpen = tournament.status == 'Open';

          return ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: Container(
              margin: const EdgeInsets.only(bottom: 20),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF1E293B)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Tournament Image + Game Badge
                  Stack(
                    children: [
                      Container(
                        height: 160,
                        width: double.infinity,
                        decoration: const BoxDecoration(
                          color: Color(0xFF1E293B),
                        ),
                        child: Image.network(
                          tournament.image.startsWith('http')
                              ? tournament.image
                              : '${ApiService.defaultProductionUrl}${tournament.image}',
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Center(
                              child: Icon(
                                Icons.sports_esports,
                                color: Colors.white.withOpacity(0.3),
                                size: 64,
                              ),
                            );
                          },
                        ),
                      ),
                      // Status Badge
                      Positioned(
                        top: 12,
                        right: 12,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: _getStatusColor(tournament.status).withOpacity(0.85),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            tournament.status.toUpperCase(),
                            style: GoogleFonts.inter(
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                      ),
                      // Game Badge
                      Positioned(
                        top: 12,
                        left: 12,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.75),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFF334155)),
                          ),
                          child: Text(
                            tournament.game,
                            style: GoogleFonts.inter(
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              color: const Color(0xFF1A73E8),
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          tournament.title,
                          style: GoogleFonts.outfit(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 12),

                        // Metrics Row
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _buildMetric(
                              icon: Icons.emoji_events,
                              label: 'PRIZE POOL',
                              value: tournament.prizePool,
                              valueColor: const Color(0xFF10B981),
                            ),
                            _buildMetric(
                              icon: Icons.calendar_today,
                              label: 'DATE & TIME',
                              value: '${tournament.date} @ ${tournament.time}',
                              valueColor: Colors.white,
                            ),
                            _buildMetric(
                              icon: Icons.groups,
                              label: 'SLOTS FILLED',
                              value: tournament.slots,
                              valueColor: const Color(0xFF1A73E8),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),

                        // Action Button
                        SizedBox(
                          width: double.infinity,
                          height: 44,
                          child: ElevatedButton(
                            onPressed: isOpen
                                ? () {
                                    Navigator.of(context).push(
                                      MaterialPageRoute(
                                        builder: (_) => TournamentRegisterScreen(tournament: tournament),
                                      ),
                                    ).then((value) {
                                      // Refresh slots after coming back
                                      _fetchTournaments();
                                    });
                                  }
                                : null,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: isOpen ? const Color(0xFF1A73E8) : const Color(0xFF1E293B),
                              disabledBackgroundColor: const Color(0xFF1E293B),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              elevation: 0,
                            ),
                            child: Text(
                              isOpen ? 'REGISTER NOW' : 'REGISTRATION CLOSED',
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                fontWeight: FontWeight.w800,
                                color: isOpen ? Colors.white : const Color(0xFF64748B),
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildMetric({
    required IconData icon,
    required String label,
    required String value,
    required Color valueColor,
  }) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 12, color: const Color(0xFF64748B)),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  label,
                  style: GoogleFonts.inter(
                    fontSize: 8.5,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF64748B),
                    letterSpacing: 0.5,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: 11.5,
              fontWeight: FontWeight.w700,
              color: valueColor,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
