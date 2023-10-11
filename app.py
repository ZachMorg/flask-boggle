from flask import Flask, request, render_template, jsonify, session
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Password3'

boggle_game = Boggle()


@app.route('/')
def home():
    """Creates board and passes session data to the current html page"""

    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get('highscore',0)
    numplays = session.get('numplays',0)
    return render_template('home.html', board=board, highscore=highscore, numplays=numplays)


@app.route('/check')
def check():
    """Checks if the word is both a valid word and on the board"""

    word = request.args['word']
    board = session['board']
    response = boggle_game.check_valid_word(board,word)
    return jsonify({'result': response})


@app.route('/final-score', methods=['POST'])
def final_score():
    """Updates high score and numplays, and returns true if highscore was changed"""

    finalscore = request.json['score']
    highscore = session.get('highscore',0)
    numplays = session.get('numplays',0)

    if finalscore > highscore:
        session['highscore'] = finalscore
    session['numplays'] = numplays + 1 

    print (session['highscore'])

    return jsonify(newRecord=finalscore > highscore)