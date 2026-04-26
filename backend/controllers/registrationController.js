// Mock registered voters database
let registeredVoters = [
  {
    id: 1,
    firstName: 'Arjun',
    lastName: 'Sharma',
    email: 'arjun@example.com',
    voterId: 'MH001234567890',
    state: 'Maharashtra',
    dateOfBirth: '1985-05-15',
    registrationDate: '2026-01-10',
    status: 'verified'
  },
  {
    id: 2,
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya@example.com',
    voterId: 'GJ001234567891',
    state: 'Gujarat',
    dateOfBirth: '1990-08-22',
    registrationDate: '2026-02-15',
    status: 'verified'
  },
  {
    id: 3,
    firstName: 'Rohit',
    lastName: 'Kumar',
    email: 'rohit@example.com',
    voterId: 'KA001234567892',
    state: 'Karnataka',
    dateOfBirth: '1988-03-10',
    registrationDate: '2026-01-20',
    status: 'pending'
  }
];

// Register voter
export const registerVoter = (req, res) => {
  try {
    const { firstName, lastName, email, voterId, state, dateOfBirth } = req.body;
    
    // Check if voter already exists
    const existingVoter = registeredVoters.find(v => v.voterId === voterId);
    if (existingVoter) {
      return res.status(409).json({
        success: false,
        error: 'Voter with this ID already registered'
      });
    }
    
    // Create new voter registration
    const newVoter = {
      id: registeredVoters.length + 1,
      firstName,
      lastName,
      email,
      voterId,
      state,
      dateOfBirth,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    registeredVoters.push(newVoter);
    
    res.status(201).json({
      success: true,
      message: 'Voter registered successfully',
      data: newVoter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get registration status
export const getRegistrationStatus = (req, res) => {
  try {
    const { voterId } = req.params;
    
    const voter = registeredVoters.find(v => v.voterId === voterId);
    
    if (!voter) {
      return res.status(404).json({
        success: false,
        error: 'Voter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Registration status retrieved successfully',
      data: {
        voterId: voter.voterId,
        name: `${voter.firstName} ${voter.lastName}`,
        state: voter.state,
        status: voter.status,
        registrationDate: voter.registrationDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Check registration status by name and date of birth
export const checkRegistration = (req, res) => {
  try {
    const { fullName, dateOfBirth, state } = req.body;
    
    // Parse full name into first and last name
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Search for matching voter
    const voter = registeredVoters.find(v => 
      v.firstName.toLowerCase() === firstName.toLowerCase() &&
      v.lastName.toLowerCase() === lastName.toLowerCase() &&
      v.dateOfBirth === dateOfBirth &&
      v.state.toLowerCase() === state.toLowerCase()
    );
    
    if (voter) {
      return res.status(200).json({
        success: true,
        isRegistered: true,
        message: 'Voter is registered',
        data: {
          name: `${voter.firstName} ${voter.lastName}`,
          state: voter.state,
          status: voter.status,
          registrationDate: voter.registrationDate,
          voterId: voter.voterId
        }
      });
    }
    
    // Not found - return unregistered status
    res.status(200).json({
      success: true,
      isRegistered: false,
      message: 'Voter is not registered',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
