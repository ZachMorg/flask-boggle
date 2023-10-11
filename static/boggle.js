class BoggleGame{

    constructor(boardId, secs = 60){
        //Sets initial values of all global variables
        this.words = new Set();
        this.board = $('#' + boardId);
        this.score = 0;
        this.time = secs;
        this.tick();
        //Runs tick every 1000 ms
        this.timer = setInterval(this.tick.bind(this), 1000);
    
        $(".inputForm", this.board).on('submit', this.checkSubmission.bind(this));
    }
    
    //Determines if a submission is a valid word

    async checkSubmission(evt){
        evt.preventDefault();
        const message = $('.message', this.board);
        const $word = $('.input', this.board)
        let word = $word.val();

        if (!word){
            return;
        }
        if(this.words.has(word)){
            message.text(`${word} has already been found`);
            $word.val('').focus();
            return;
        }
        
        const response = await axios.get('/check',{params: {word:word}});
        if (response.data.result === 'not-on-board'){
            message.text(`${word} is not on this board`);
        }
        else if (response.data.result === 'not-word'){
            message.text(`${word} is not a word`);
        }
        //Word is valid: Score, wordList, and message are updated
        else {
            this.score += (word.length);
            message.text(`You found: ${word}`);
            this.words.add(word);
            $('.wordList', this.board).append($('<li>', {text: word}));
            $('.score', this.board).text(`Score: ${this.score}`);
        }
        $word.val('').focus();
    }

    //decrements time, displays time, and checks for time reaching zero

    async tick(){
        this.time--;
        $('.timer', this.board).text(`Time Remaining: ${this.time}`);

        if(this.time === 0){
            await this.scoreGame();
        }
    }

    //Posts the final score to the server and displays highscore

    async scoreGame(){
        $('.inputForm', this.board).hide();
        $('.timer', this.board).hide();
        $('.message', this.board).hide();

        const response = await axios.post('/final-score', {score: this.score});
        if (response.data.newRecord){
            $('.newHighscore', this.board).show();
            $('.currentHighscore', this.board).hide();
        }
        else{
            $('.score', this.board).text(`Final Score: ${this.score}`);
        }
    }
}