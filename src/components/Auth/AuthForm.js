import { useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
 
  const authCtx=useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const history=useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const submitHandler=(event)=>{
    event.preventDefault();

    const enteredEmail=emailInputRef.current.value;
    const enteredPassword=passwordInputRef.current.value;

    setIsLoading(true);
    let url;
    if(isLogin){
      url='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCPc1H6MZGuw9aWXS0zyUUZYwsMrCgX_IM'
    }else{
      url='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCPc1H6MZGuw9aWXS0zyUUZYwsMrCgX_IM'
    }
    fetch(url,
    {
      method: 'POST',
      body: JSON.stringify({
        email:enteredEmail,
        password:enteredPassword,
        returnSecureToken:true
      }),
      headers:{
        'Content-Type': 'application/json'
      }

    }
    ).then(res=>{
      setIsLoading(false);
      if(res.ok){
        return res.json().then(data=>{
          if(data){
            authCtx.login(data.idToken);
            history.replace('/');
            console.log(data);

          }
        });
      
      }else{
        return res.json().then(data=>{
          let errMsg='Authentication failed';
          if(data&&data.error&&data.error.message){
            errMsg=data.error.message;
          }
          alert(errMsg)
          console.log(data);
         // throw new Error (errMsg);
        })
      }
    });
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
        {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
        {isLoading &&<p>Sending request ...</p>}
         
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
           
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
