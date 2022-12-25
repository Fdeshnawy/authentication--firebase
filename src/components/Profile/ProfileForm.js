import { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
 const authCtx = useContext(AuthContext);
 const newPassword = useRef();

 const history=useHistory();

 const submitHadler =(e)=>{
  e.preventDefault();
  const enteredNewPass = newPassword.current.value;

  fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCPc1H6MZGuw9aWXS0zyUUZYwsMrCgX_IM',
    {
      method: 'POST',
      body: JSON.stringify({
        idToken:authCtx.token,
        password:enteredNewPass,
        returnSecureToken:false
      }),
      headers:{
        'Content-Type': 'application/json'
      }

    }
    ).then(res=>{
      
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
    <form className={classes.form} onSubmit={submitHadler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPassword}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
