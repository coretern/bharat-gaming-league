import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tournament_app/main.dart';

void main() {
  testWidgets('App renders smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp(isLoggedIn: false));
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
