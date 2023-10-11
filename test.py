from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):

        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_home(self):

        with self.client:
            response = self.client.get('/')
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('numplays'))
            self.assertIn(b'<h4 class="currentHighscore">High Score:', response.data)
            self.assertIn(b'<h4 class="score">', response.data)
            self.assertIn(b'<h3 class="timer">', response.data)

    def test_valid_word(self):

        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [['W','O','R','D','S'],
                                 ['W','O','R','D','S'],
                                 ['W','O','R','D','S'],
                                 ['W','O','R','D','S'],
                                 ['W','O','R','D','S']]
        response = self.client.get('/check?word=word')
        self.assertEqual(response.json['result'], 'ok')

    def test_not_on_board(self):

        self.client.get('/')
        response = self.client.get('/check?word=alligator')
        self.assertEqual(response.json['result'], 'not-on-board')

    def test_not_word(self):

        self.client.get('/')
        response = self.client.get('/check?word=abababababababababa')
        self.assertEqual(response.json['result'], 'not-word')

