class Tournament {
  final String id;
  final String title;
  final String game;
  final String prizePool;
  final String date;
  final String time;
  final String slots;
  final String image;
  final String status;
  final List<String> allowedMatchTypes;

  Tournament({
    required this.id,
    required this.title,
    required this.game,
    required this.prizePool,
    required this.date,
    required this.time,
    required this.slots,
    required this.image,
    required this.status,
    required this.allowedMatchTypes,
  });

  factory Tournament.fromJson(Map<String, dynamic> json) {
    var allowedListRaw = json['allowedMatchTypes'];
    List<String> matchTypes = [];
    if (allowedListRaw is List) {
      matchTypes = allowedListRaw.map((e) => e.toString()).toList();
    } else {
      matchTypes = ['Solo', 'Duo', 'Squad'];
    }

    return Tournament(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      game: json['game'] ?? 'BGMI',
      prizePool: json['prizePool'] ?? '',
      date: json['date'] ?? '',
      time: json['time'] ?? '',
      slots: json['slots'] ?? '0/48',
      image: json['image'] ?? '',
      status: json['status'] ?? 'Open',
      allowedMatchTypes: matchTypes,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'game': game,
      'prizePool': prizePool,
      'date': date,
      'time': time,
      'slots': slots,
      'image': image,
      'status': status,
      'allowedMatchTypes': allowedMatchTypes,
    };
  }
}
