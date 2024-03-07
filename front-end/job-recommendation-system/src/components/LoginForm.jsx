import { useState } from 'react'
import './LoginForm.css'
import { useForm } from 'react-hook-form'
import Mail from '@mui/icons-material/Mail'
import Lock from '@mui/icons-material/Lock'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, IconButton, TextField, Stack } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';

function LoginForm() {

  const { register, formState: { errors }, handleSubmit } = useForm();
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const userType = location["pathname"].includes("employer")?"employer":"seeker";
  function handleVisibility(){
    setVisible(!visible);
  }
  function loginSubmit(data){
    const newData={...data, "user": userType}
    console.log("Login data ==>",newData)
  }
  // const { info, setInfo } = useState(); 

  // console.log("errors", { errors })
  return (
    <>
      {/*Login Form*/}
      <div className="login_container">

        <form noValidate autoComplete='off' onSubmit={handleSubmit(loginSubmit)}>
          <h3 className="text-center login-header">Login</h3>
          <br />
          <Box sx={{ boxShadow: 2, paddingBottom: 4, paddingTop: 3, paddingX: 3, borderRadius: 5, width: 280 ,display:'flex',flexDirection:'column'}}>
            <p className="lg">Login with Credentials</p><br />
            <Stack spacing={2}>

              {/*email box validation checking*/}
              <Box sx={{ display: 'flex', alignItems: 'email' in errors ? 'center' : 'flex-end', gap: 1 }}>
                <Mail />
                <TextField variant="standard"
                  label="Email"
                  type='email'
                  helperText={'email' in errors ? errors.email?.message : ""}
                  error={'email' in errors}
                  {...register("email",
                    {
                      required: "please enter email",
                      pattern: {
                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Email not valid"
                      }
                    })} />

              </Box>

              {/*password box validation checking*/}
              <Box sx={{ display: 'flex', alignItems: 'password' in errors ? 'center' : 'flex-end', gap: 1 }}>
                    <Lock sx={{ position: 'relative', top: 0 }} />
                    <TextField variant="standard"
                    label="Password"
                    type={visible?"text":"password"}
                    helperText={'password' in errors ? errors.password?.message : ""}
                    error={'password' in errors}
                    {...register("password",
                        {
                        required: "password is required",
                        // pattern: {
                        //   value: /^(?=.*[0-9])(?=.*[!@#$%^&*.,])[a-zA-Z0-9!@#$%^&*.,]{6,16}$/,
                        //   message: "password must be atleast 8 characters long"
                        // }
                        })} 
                      />
                    <Box onClick={handleVisibility}>{visible?<VisibilityIcon sx={{fontSize:'medium', position: 'relative', top: -2}}/>:<VisibilityOffIcon sx={{fontSize:'medium', position: 'relative', top: -2}}/>}</Box>
                </Box>
            </Stack>
            <IconButton type="submit" sx={{ borderRadius: 50, backgroundColor: '#E7E4E4', position: 'relative', top: 20 , alignSelf:'center',width:45,height:45}}>
              <ArrowForwardRoundedIcon sx={{ color: 'black' }} />
            </IconButton>
          </Box>

        </form>

        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", height: "auto"}}>
        <br /><a href="" className="lk">forgot your password?</a>
        <Link to={'../signup/'+ userType}  state={{"userType": userType}}><p className="sigup-redirect">New User? SignUp</p></Link>
        </Box>


      </div>
    </>
  )
}

export default LoginForm;