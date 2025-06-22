import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Resume Analyzer
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Optimize your resume for better job opportunities
        </Typography>
        {!isAuthenticated && (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              ATS Score Analysis
            </Typography>
            <Typography variant="body1">
              Get an instant score of how well your resume will perform in Applicant Tracking Systems.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Detailed Feedback
            </Typography>
            <Typography variant="body1">
              Receive comprehensive analysis of your resume's strengths and areas for improvement.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Actionable Suggestions
            </Typography>
            <Typography variant="body1">
              Get specific recommendations to enhance your resume's effectiveness.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 8, mb: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6">1. Upload</Typography>
            <Typography variant="body1">
              Upload your resume in PDF format
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6">2. Analyze</Typography>
            <Typography variant="body1">
              Our AI analyzes your resume
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6">3. Review</Typography>
            <Typography variant="body1">
              Get detailed feedback and suggestions
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6">4. Improve</Typography>
            <Typography variant="body1">
              Implement changes and boost your chances
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {isAuthenticated && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/resume-analysis')}
          >
            Analyze Your Resume Now
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Home; 