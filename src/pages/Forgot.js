import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
// layouts
// components
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  Link,
  Stack,
  Container,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import Page from '../components/Page';
import { axiosInstance } from '../axios/base.axios';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function ForgotComponent() {
  const [searchParams] = useSearchParams();
  const [isResetPsw, setIsResetPsw] = useState(false);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const ForgotSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required')
  });

  const ResetPswSchema = Yup.object().shape({
    password: Yup.string().required('Password is required')
  });

  useEffect(() => {
    const hasToken = searchParams.has('token');
    if (hasToken) {
      setIsResetPsw(true);
    }
  }, []);

  const forgotFormik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: ForgotSchema,
    onSubmit: (data) => {
      axiosInstance
        .post('/user/forgot', data)
        .then((res) => res.data)
        .then((resp) => {
          forgotFormik.setSubmitting(false);
          navigate('/login', { replace: true });
        })
        .catch((err) => {
          forgotFormik.setSubmitting(false);
        });
    }
  });

  const resetFormik = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: ResetPswSchema,
    onSubmit: (data) => {
      const hasToken = searchParams.has('token');
      if (hasToken) {
        const oData = {
          newPassword: data.password,
          token: searchParams.get('token')
        };
        axiosInstance
          .post('/user/verify_forgot_by_mail', oData)
          .then((res) => res.data)
          .then((resp) => {
            resetFormik.setSubmitting(false);
            navigate('/login', { replace: true });
          })
          .catch((err) => {
            resetFormik.setSubmitting(false);
          });
      } else {
        alert('Reset link not provided');
        resetFormik.setSubmitting(false);
      }
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = forgotFormik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <RootStyle title="Login | Journal of Innovative Agriculture">
      <Container maxWidth="sm">
        <ContentStyle>
          <Stack style={{ marginBottom: '10px' }}>
            <Typography style={{ fontSize: '18px' }}> Forgot Password </Typography>
          </Stack>
          {!isResetPsw ? (
            <FormikProvider value={forgotFormik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack>
                  <TextField
                    fullWidth
                    autoComplete="off"
                    type="email"
                    label="Email address"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Stack>

                <LoadingButton
                  style={{ marginTop: '10px' }}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Submit
                </LoadingButton>
              </Form>
            </FormikProvider>
          ) : (
            <FormikProvider value={resetFormik}>
              <Form autoComplete="off" noValidate onSubmit={resetFormik.handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    autoComplete="current-password"
                    type={showPassword ? 'text' : 'password'}
                    label="New Password"
                    {...resetFormik.getFieldProps('password')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword} edge="end">
                            <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(resetFormik.touched.password && resetFormik.errors.password)}
                    helperText={resetFormik.touched.password && resetFormik.errors.password}
                  />
                </Stack>

                <LoadingButton
                  style={{ marginTop: '10px' }}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={resetFormik.isSubmitting}
                >
                  Submit
                </LoadingButton>
              </Form>
            </FormikProvider>
          )}
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Don’t have an account?&nbsp;
            <Link variant="subtitle2" component={RouterLink} to="register">
              Get started
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
