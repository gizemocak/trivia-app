const ROOT_URL = 'https://opentdb.com/api.php?';

(function(){
    // define elements
    var $form = $('#form');
    var $number = $('#form-number');
    var $category = $('#form-category');
    var $difficulty = $('#form-difficulty');
    var $type = $('#form-type');
    var $container = $('#card-container');
    var $card = $('.card');
    var $main = $('main');
    var $loader = $('#loader');
    var $error = $('#error');
    // Keep track of each element's answers
    var cards = [];
    // Helper functions
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
    }

    // Check whether the div pressed contains the correct answer.
    function checkAnswer(answer, parent){
        var id = Number(parent.attr('id').replace('card-',''));
        if(answer.text()===cards[id].correct_answer){
            answer.css({"background-color": "#27ae60", "color": "white"});
            parent.css('background-color', '#27ae60')
        } else{
            answer.css({"background-color": "#c0392b", "color": "white", "text-decoration": "line-through"})
        }
    }
    // Event listener to generate trivia cards
    $form.on('submit', function(e){
        e.preventDefault();
        $main.fadeOut();
        $loader.css('display', 'block');
        $.ajax({
            url: ROOT_URL+'amount='+$number.val()+($category.val()!=='any'?'&category='+$category.val():'')+($difficulty.val()!=='any'?'&difficulty='+$difficulty.val():'')+($type.val()!=='any'?'&type='+$type.val():''),
            type: 'GET',
            success: function(res){
                if(res.results.length==0){
                    $loader.css('display', 'none');
                    $container.fadeOut(function(){
                        $error.css('display' ,'flex');
                    })
                    return;
                }
                $loader.fadeOut(function(){
                    cards = res.results;
                    var i = 0;
                    var j = 0;
                    cards.forEach(function(card){
                        setTimeout(function(){
                            var mArray = shuffle([card.correct_answer, ...card.incorrect_answers]);
                            card.type==='boolean'?mArray.sort(-1):null;
                            $container.append("<div class='card' id='card-"+i+"'>\
                            <h2>"+card.category+"</h2>\
                            <p class='card-question'>"+card.question+"</p>\
                            </div>")
                            mArray.forEach(function(ans){
                                $('#card-'+i).append('<p class="card-answer">'+ans+'</p>')
                            })
                            i+=1;
                        }, j*500)
                        j++;
                    })                  
                })
            },
            error: function(xhr){
                $loader.css('display', 'none');
                $container.fadeOut(function(){
                    $error.css('display' ,'flex');
                })
                return;
            }
        })
    })

    // Event listener on answers
    $container.on('click', function(e){
        switch(e.target.className){
            case 'card-answer':
                checkAnswer($(e.target), $(e.target).parent())
                break;
        }
    })
})()