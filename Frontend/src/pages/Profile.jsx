import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, Paper, Typography, Box, Avatar, Button, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUserAnalyses } from '../services/analysisService';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const data = await getUserAnalyses();
        setAnalyses(data);
        
      } catch (error) {
        console.error('Error fetching resume analyses:', error);
        setError('Failed to load resume analyses');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  console.log(analyses);
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              sx={{ width: 100, height: 100, mb: 2 }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="h4" gutterBottom>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user?.email || 'user@example.com'}
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Member Since:</strong> {new Date().toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                <strong>Account Type:</strong> Free
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recent Resume Analyses
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            ) : analyses.length > 0 ? (
              <List>
                {analyses.map((analysis) => (
                  <ListItem key={analysis.id}>
                    <ListItemText
                      primary={analysis.fileName}
                      secondary={`ATS Score: ${analysis.overallScore}%`}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/resume-analysis/${analysis.id}`)}
                    >
                      View Details
                    </Button>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                No resume analyses yet
              </Typography>
            )}
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/resume-analysis')}
            >
              Analyze Resume
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/')}
            >
              View Dashboard
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 