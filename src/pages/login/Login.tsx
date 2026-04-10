import { useState } from "react";
import styles from "./Login.module.scss";
import logo from "../../assets/images/logo.svg";
import illustration from "../../assets/images/pablo-sign-in.svg";
import { Link } from "react-router-dom";
import validateEmail from "../../hooks/validateEmail";
import Spinner from "../../components/spinner/Spinner";


const Login = () => {
  const[email, setEmail] = useState<string>("");
  const[password, setPassword] = useState<string>("");
  const[isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const[isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const validateEmailBeforeLogin = () => {
    if(email !== "" && !validateEmail(email)) {
      setEmailError('Email address is an invalid format');
    } 
  }

  const loginHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Email field cannot be empty");
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password field cannot be empty");
    } else {
      setPasswordError("");
    }

    if(email && !validateEmail(email)) {
      setEmailError('Email address is an invalid format');
    } 

    setIsSigningIn(true);

    validateEmailBeforeLogin();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError && e.target.value) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError && e.target.value) {
      setPasswordError("");
    }
  }

  return (
    <main className={styles.login_main}>
      <div className={styles.illustration_div}>
        <img className={styles.logo_image} src={logo} alt="logo" />
        <img className={styles.illustration_image} src={illustration} alt="" />
      </div>

      <section className={styles.form_section}>
        <div className={styles.formWrapper}>
          <img className={styles.mobile_logo} src={logo} alt="logo" />
          <h1>Welcome</h1>
          <p>Enter details to login.</p>
          <form onSubmit={loginHandler}>
            <div className={styles.input_div}>
              <input placeholder=" " id="email" type="email" value={email} onChange={handleEmailChange} />
              <label htmlFor="email">Email</label>
            </div>
            
            <div className={styles.error_message}>{emailError}</div>

            <div className={styles.input_div}>
              <input placeholder=" " id="password" type={isPasswordVisible ? "text" : "password"} value={password} onChange={handlePasswordChange} />
              <label htmlFor="password">Password</label>
              <button className={styles.show_password_button} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                {isPasswordVisible ? "HIDE" : "SHOW"}
              </button>
            </div>
            <div className={styles.error_message}>{passwordError}</div>

            <Link to="#" className={styles.forgot_password_link}>Forgot PASSWORD?</Link>
            <button type="submit" className={styles.login_button} disabled={isSigningIn}>
              {isSigningIn ? 
                <Spinner/> :
                <span>LOG IN</span>
              }
              
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
export default Login