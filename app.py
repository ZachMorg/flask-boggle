from flask import Flask, request, render_template, jsonify, session
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Password'

boggle_game = Boggle()


@app.route('/')
def home():

    board = boggle_game.make_board()
    session['board'] = board
    return render_template('home.html', board=board)


@app.route('/check')
def check():

    word = request.args['word']
    board = session['board']
    response = boggle_game.check_valid_word(board,word)
    return jsonify({'result': response})


@app.route('/final-score', methods=['POST'])
def final_score():

    return 