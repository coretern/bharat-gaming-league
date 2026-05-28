class PlayerRosterItem {
  final String name;
  final String uid;
  final String instagram;

  PlayerRosterItem({
    required this.name,
    required this.uid,
    required this.instagram,
  });

  factory PlayerRosterItem.fromJson(Map<String, dynamic> json) {
    return PlayerRosterItem(
      name: json['name'] ?? '',
      uid: json['uid'] ?? '',
      instagram: json['instagram'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'uid': uid,
      'instagram': instagram,
    };
  }
}

class Registration {
  final String id;
  final String userId;
  final String userName;
  final String userEmail;
  final String tournamentId;
  final String tournamentName;
  final String game;
  final String matchType;
  final String teamName;
  final String whatsapp;
  final String instagram;
  final List<PlayerRosterItem> players;
  final String status;
  final String paymentStatus;
  final String orderId;
  final bool paymentVerified;
  final String rejectionReason;
  final List<String> rejectionTargets;
  final List<int> rejectionIndices;
  final int groupNumber;
  final int slotNumber;
  final String resultStatus;
  final double prizeAmount;
  final double entryFee;
  final String roomId;
  final String roomPassword;
  final String winnerTeamName;
  final String winnerScreenshot;
  final String matchDate;
  final String matchTime;
  final DateTime createdAt;

  Registration({
    required this.id,
    required this.userId,
    required this.userName,
    required this.userEmail,
    required this.tournamentId,
    required this.tournamentName,
    required this.game,
    required this.matchType,
    required this.teamName,
    required this.whatsapp,
    required this.instagram,
    required this.players,
    required this.status,
    required this.paymentStatus,
    required this.orderId,
    required this.paymentVerified,
    required this.rejectionReason,
    required this.rejectionTargets,
    required this.rejectionIndices,
    required this.groupNumber,
    required this.slotNumber,
    required this.resultStatus,
    required this.prizeAmount,
    required this.entryFee,
    required this.roomId,
    required this.roomPassword,
    required this.winnerTeamName,
    required this.winnerScreenshot,
    required this.matchDate,
    required this.matchTime,
    required this.createdAt,
  });

  factory Registration.fromJson(Map<String, dynamic> json) {
    var playersRaw = json['players'] as List? ?? [];
    List<PlayerRosterItem> playersList =
        playersRaw.map((e) => PlayerRosterItem.fromJson(e)).toList();

    var targetsRaw = json['rejectionTargets'] as List? ?? [];
    List<String> targets = targetsRaw.map((e) => e.toString()).toList();

    var indicesRaw = json['rejectionIndices'] as List? ?? [];
    List<int> indices = indicesRaw.map((e) => int.tryParse(e.toString()) ?? 0).toList();

    double parseDouble(dynamic val) {
      if (val == null) return 0.0;
      if (val is num) return val.toDouble();
      return double.tryParse(val.toString()) ?? 0.0;
    }

    int parseInt(dynamic val) {
      if (val == null) return 0;
      if (val is num) return val.toInt();
      return int.tryParse(val.toString()) ?? 0;
    }

    return Registration(
      id: json['_id'] ?? json['id'] ?? '',
      userId: json['userId'] ?? '',
      userName: json['userName'] ?? '',
      userEmail: json['userEmail'] ?? '',
      tournamentId: json['tournamentId'] ?? '',
      tournamentName: json['tournamentName'] ?? '',
      game: json['game'] ?? 'BGMI',
      matchType: json['matchType'] ?? 'Solo',
      teamName: json['teamName'] ?? '',
      whatsapp: json['whatsapp'] ?? '',
      instagram: json['instagram'] ?? '',
      players: playersList,
      status: json['status'] ?? 'Pending',
      paymentStatus: json['paymentStatus'] ?? 'Pending',
      orderId: json['orderId'] ?? '',
      paymentVerified: json['paymentVerified'] ?? false,
      rejectionReason: json['rejectionReason'] ?? '',
      rejectionTargets: targets,
      rejectionIndices: indices,
      groupNumber: parseInt(json['groupNumber']),
      slotNumber: parseInt(json['slotNumber']),
      resultStatus: json['resultStatus'] ?? 'Playing',
      prizeAmount: parseDouble(json['prizeAmount']),
      entryFee: parseDouble(json['entryFee']),
      roomId: json['roomId'] ?? '',
      roomPassword: json['roomPassword'] ?? '',
      winnerTeamName: json['winnerTeamName'] ?? '',
      winnerScreenshot: json['winnerScreenshot'] ?? '',
      matchDate: json['matchDate'] ?? '',
      matchTime: json['matchTime'] ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'userName': userName,
      'userEmail': userEmail,
      'tournamentId': tournamentId,
      'tournamentName': tournamentName,
      'game': game,
      'matchType': matchType,
      'teamName': teamName,
      'whatsapp': whatsapp,
      'instagram': instagram,
      'players': players.map((e) => e.toJson()).toList(),
      'status': status,
      'paymentStatus': paymentStatus,
      'orderId': orderId,
      'paymentVerified': paymentVerified,
      'rejectionReason': rejectionReason,
      'rejectionTargets': rejectionTargets,
      'rejectionIndices': rejectionIndices,
      'groupNumber': groupNumber,
      'slotNumber': slotNumber,
      'resultStatus': resultStatus,
      'prizeAmount': prizeAmount,
      'entryFee': entryFee,
      'roomId': roomId,
      'roomPassword': roomPassword,
      'winnerTeamName': winnerTeamName,
      'winnerScreenshot': winnerScreenshot,
      'matchDate': matchDate,
      'matchTime': matchTime,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
