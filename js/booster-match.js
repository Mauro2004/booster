function getMatches() {
    $('.progress').fadeIn(1200);
    return new Promise ((resolve, reject) => {
        axios.get('matches/random')
        .then( ({data}) => {
        data.forEach(user => {
        var card = `<li id="${user.id}">
            <div class="card card-wrapper card-action">
                <div class="card-up" style="filter:blur(5px) grayscale(60%)">
                    <img class="card-img-top" src="{{URL::asset('foto_perfil/'.'${user.profile_picture}' )}}" draggable="false">
                </div>
                <div class="avatar mx-auto white"><img src="{{URL::asset('foto_perfil/'.'${user.profile_picture}' )}}"
                        class="rounded-circle"
                        style="filter: blur(0px);max-width: 110px;max-height: 110px;height:110px;width:110px" draggable="false">
                </div>

                <div class="card-body text-center">
                    <h4 class="card-title"><strong></strong></h4>
                    <h5 class="blue-text pb-2"><strong>${user.name}</strong></h5>
                    <p class="card-text">${user.profile}</p>
                    <h6 class="black-text pb-2"><strong>Experiencia: ${user.experience_years} años</strong></h6>
                    <a class="px-2 fa-lg li-ic"><i class="fab fa-linkedin-in"></i></a>>
                    <a class="px-2 fa-lg tw-ic"><i class="fab fa-twitter"></i></a>
                    <a class="px-2 fa-lg fb-ic pb-2"><i class="fab fa-facebook-f"></i></a>    
                </div>
                <div class="like"></div>
                <div class="dislike"></div>
            </div>
        </li>`
        $("#profiles").append(card);
        resolve('Cards on DOM')
        });
        })
    })
}

function matchAction(profile_id, action){
    return new Promise ((resolve,reject) => {
        axios.post('matches/action', {
            profile: profile_id,
            action: action
        })
        .then( ({data}) => {
            if(data.status == 'newMatch'){
                $('.match-popup').show().fadeIn(100).addClass('animated fadeIn bounceIn');
            }
        })
        .catch( (e)=>{
            console.log(e)
        })
    })
}

function initSwipe(){
    $("#profiles-wrapper").jTinder({
    onDislike: function (item) {
    matchAction(item[0].id, 'disliked');
    item.remove()
    },
    onLike: function (item) {
    matchAction(item[0].id, 'liked');
    item.remove()
    },
    likeSelector: '.like',
    dislikeSelector: '.dislike'
    });
    $('.progress').fadeOut('slow');
}

$('document').ready(function(){
    $('.progress').fadeOut(100);
    getMatches()
    .then( () => {
        initSwipe();
    })
});

$('#close-match-popup').click(function(){
    $('.match-popup').removeClass('fadeIn bounceIn');
    $('.match-popup').addClass('animated fadeOut').fadeOut(100).hide()
});

$('#profiles').bind('DOMSubtreeModified', function(e) {
    if($('#profiles li').length <= 0){
        getMatches()
        .then( () => {
            $("#profiles-wrapper").data('plugin_jTinder').destroy();
            initSwipe();
        })
    }
});

$('.like-btn').click(function(e){
    e.preventDefault();
    $("#profiles-wrapper").jTinder('like');
});

$('.dislike-btn').click(function(e){
    e.preventDefault();
    $("#profiles-wrapper").jTinder('dislike');
});