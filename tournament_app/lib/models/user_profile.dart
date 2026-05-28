import 'registration.dart';

class UserProfile {
  final String email;
  final String name;
  final String image;
  final String teamName;
  final String gameUsername;
  final String gameUID;
  final String whatsapp;
  final String instagram;
  final String paymentQrUrl;
  final List<PlayerRosterItem> savedPlayers;
  final bool hasPassword;

  UserProfile({
    required this.email,
    required this.name,
    required this.image,
    required this.teamName,
    required this.gameUsername,
    required this.gameUID,
    required this.whatsapp,
    required this.instagram,
    required this.paymentQrUrl,
    required this.savedPlayers,
    required this.hasPassword,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    var savedPlayersRaw = json['savedPlayers'] as List? ?? [];
    List<PlayerRosterItem> savedList =
        savedPlayersRaw.map((e) => PlayerRosterItem.fromJson(e)).toList();

    return UserProfile(
      email: json['email'] ?? '',
      name: json['name'] ?? '',
      image: json['image'] ?? '',
      teamName: json['teamName'] ?? '',
      gameUsername: json['gameUsername'] ?? '',
      gameUID: json['gameUID'] ?? '',
      whatsapp: json['whatsapp'] ?? '',
      instagram: json['instagram'] ?? '',
      paymentQrUrl: json['paymentQrUrl'] ?? '',
      savedPlayers: savedList,
      hasPassword: json['hasPassword'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'name': name,
      'image': image,
      'teamName': teamName,
      'gameUsername': gameUsername,
      'gameUID': gameUID,
      'whatsapp': whatsapp,
      'instagram': instagram,
      'paymentQrUrl': paymentQrUrl,
      'savedPlayers': savedPlayers.map((e) => e.toJson()).toList(),
      'hasPassword': hasPassword,
    };
  }
}
