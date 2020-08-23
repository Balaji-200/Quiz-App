const passIconSignUpPassword = document.getElementById('passIconSignUpPassword');
const passIconConfirm = document.getElementById('passIconConfirm');
const signUpUsername = document.getElementById('signUpUsername');
const signUpPassword = document.getElementById('signUpPassword');
const confirmPassword = document.getElementById('confirmPassword');

const signUpForm = document.getElementById('SignUpForm');

const modalBody = document.getElementById('modal-body');
const ok = document.getElementById('ok');
const modalHead = document.getElementById('modal-head');

const letter = document.getElementById('letter');
const number = document.getElementById('number');
const characters = document.getElementById('Characters');
const password = document.getElementById('password');

const submit = document.getElementById('submit');
const cancel = document.getElementById('cancel');

const right = '&#x2713;';
const wrong = '&#10005;';
const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;


signUpPassword.addEventListener('input',()=>{
    var value = signUpPassword.value;
    // console.log(signUpPassword.value.search(/[a-z]/));
    if(/[a-z]/.test(value) || /[A-Z]/.test(value))
        letter.innerHTML = right ;
    else
        letter.innerHTML = wrong;

    if(/[0-9]/.test(value))
        number.innerHTML = right ;
    else
        number.innerHTML = wrong;

    if(/[!@#$%^&*]/.test(value))
        characters.innerHTML = right ;
    else
        characters.innerHTML = wrong;
    
    if(value.length>=8)
        password.innerHTML = right;
    else
        password.innerHTML = wrong;
});


submit.addEventListener('click',()=>{
    if(signUpPassword.value.match(regularExpression)){
        if(signUpPassword.value != confirmPassword.value)
            alert("Your confirm Password doesn't match with entered password");
        else{
            const data = {
                username: signUpUsername.value,
                password: signUpPassword.value
            }
            signUp(data);
        }
    }else{
        alert('Please check your passsword requirements.')
    }
    
})


passIconConfirm.addEventListener('click',()=>{
    ToggleIcon(passIconConfirm,confirmPassword);
});
passIconSignUpPassword.addEventListener('click',()=>{
    ToggleIcon(passIconSignUpPassword,signUpPassword);
});


function ToggleIcon(ic,inp){
    if(ic.classList.contains('fa-eye')){
        ic.classList.remove('fa-eye');
        ic.classList.add('fa-eye-slash')
        inp.setAttribute('type','password');
    }else{
        ic.classList.remove('fa-eye-slash');
        ic.classList.add('fa-eye');
        inp.setAttribute('type','text');
    }
}

function signUp(data){
    const http = new XMLHttpRequest();
    http.open('POST','/users/signup',true);
    http.setRequestHeader('Content-Type','application/json');
    http.onload = ()=>{
        let response = JSON.parse(http.responseText);
        if(http.readyState == 4 && http.status == 200){
            modalBody.children[0].innerHTML = response.message;
            modalBody.children[1].innerHTML = `Now you can login , Click <b>OK</b> to login.`
            $('#alerts').modal('show');
            ok.addEventListener('click',()=>{
                $('#alerts').modal('toggle');
                location.href = '/';
            })
        }
        if(http.readyState == 4 && http.status == 409){
            modalHead.innerText = 'User Already exists.';
            modalBody.children[0].innerHTML = response.message;
            modalBody.children[1].innerHTML = `Please, Click <b>OK</b> to login.`;
            $('#alerts').modal('show');
            ok.addEventListener('click',()=>{
                $('#alerts').modal('toggle');
                location.href = '/';
            })
        }
    };
    http.send(JSON.stringify(data));

}