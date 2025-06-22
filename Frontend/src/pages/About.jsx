import { Container, Paper, Typography, Box } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            About Resume Analyzer
          </Typography>
          
          <Typography variant="body1" paragraph>
            Welcome to Resume Analyzer, your intelligent resume optimization platform. Our mission is to help job seekers create more effective resumes that stand out to employers and pass through Applicant Tracking Systems (ATS).
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Our Features
          </Typography>
          <Typography variant="body1" paragraph>
            • ATS Score Analysis: Get an instant score of how well your resume will perform in ATS systems
          </Typography>
          <Typography variant="body1" paragraph>
            • Detailed Feedback: Receive comprehensive analysis of your resume's strengths and areas for improvement
          </Typography>
          <Typography variant="body1" paragraph>
            • Actionable Suggestions: Get specific recommendations to enhance your resume's effectiveness
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            How It Works
          </Typography>
          <Typography variant="body1" paragraph>
            1. Upload your resume in PDF format
          </Typography>
          <Typography variant="body1" paragraph>
            2. Our AI-powered system analyzes your resume
          </Typography>
          <Typography variant="body1" paragraph>
            3. Receive detailed feedback and suggestions
          </Typography>
          <Typography variant="body1" paragraph>
            4. Implement the changes and improve your chances of landing interviews
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default About; 