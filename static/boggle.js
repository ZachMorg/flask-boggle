class Boggle{

    constructor(boardId){
        this.words = new Set();
        this.board = $('#' + boardId);
        
        $(".inputForm", this.board).on("submit", this.checkSubmission.bind(this));
        console.log(this.form);
        console.log(this.words);
        this.testMethod();
    }

    testMethod(){
        console.log(this.form);
    }

    


    async checkSubmission(evt){
        evt.preventDefault();
        const $word = $('.input', this.board)
        let word = $word.val();
        if (!word){
            return;
        }
        console.log(this.words);
        console.log(this.board);
        console.log(this.form);
        console.log(word);
        if(this.words.has(word)){
                return;
            }
                
        const response = await axios.get('/check',{params: {word:word}});
        let message = $('.message', this.board);
        if (response.data.result === 'not-on-board'){
            message.innerText = `${word} is not on this board`
        }
        else if (response.data.result === 'not-a-word'){
            message.innerText = `${word} is not a word`
        }
        else {
            message.innerText = `You found: ${word}`
            this.words.add(word);
            $('.wordList', this.board).text(word)
        }
        $word.val('').focus();
    }
}