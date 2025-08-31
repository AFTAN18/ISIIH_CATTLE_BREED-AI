export interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'veterinarian' | 'expert' | 'admin';
  phone?: string;
  location?: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'farmer' | 'veterinarian' | 'expert';
  location?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'bharat_pashudhan_token';
  private readonly USER_KEY = 'bharat_pashudhan_user';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Input validation
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          message: 'Email and password are required'
        };
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        return {
          success: false,
          message: 'Please enter a valid email address'
        };
      }

      // Make secure API call to backend
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Login failed'
        };
      }

      if (data.success && data.user && data.accessToken) {
        // Store tokens securely (httpOnly cookies would be better in production)
        sessionStorage.setItem(this.TOKEN_KEY, data.accessToken);
        sessionStorage.setItem('refresh_token', data.refreshToken);
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(data.user));

        return {
          success: true,
          user: data.user,
          token: data.accessToken,
          message: 'Login successful'
        };
      }

      return {
        success: false,
        message: 'Invalid response from server'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      // Input validation
      if (!data.email || !data.password || !data.name) {
        return {
          success: false,
          message: 'Name, email, and password are required'
        };
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return {
          success: false,
          message: 'Please enter a valid email address'
        };
      }

      // Password strength validation
      if (data.password.length < 8) {
        return {
          success: false,
          message: 'Password must be at least 8 characters long'
        };
      }

      // Make secure API call to backend
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: responseData.message || 'Registration failed'
        };
      }

      if (responseData.success && responseData.data && responseData.data.token) {
        // Store tokens securely
        sessionStorage.setItem(this.TOKEN_KEY, responseData.data.token);
        if (responseData.data.refreshToken) {
          sessionStorage.setItem('refresh_token', responseData.data.refreshToken);
        }
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(responseData.data.user));

        return {
          success: true,
          user: responseData.data.user,
          token: responseData.data.token,
          message: 'Account created successfully'
        };
      }

      return {
        success: false,
        message: 'Invalid response from server'
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = sessionStorage.getItem('refresh_token');
      
      if (refreshToken) {
        // Notify backend to invalidate session
        await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
          },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call result
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem('refresh_token');
      sessionStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  getCurrentUser(): User | null {
    try {
      const userStr = sessionStorage.getItem(this.USER_KEY) || localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY) || localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!(this.getToken() && this.getCurrentUser());
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = sessionStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        return null;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        sessionStorage.setItem(this.TOKEN_KEY, data.accessToken);
        sessionStorage.setItem('refresh_token', data.refreshToken);
        return data.accessToken;
      }

      // Refresh failed, logout user
      await this.logout();
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      await this.logout();
      return null;
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Password reset link sent to your email'
      };
    } catch {
      return {
        success: false,
        message: 'Failed to send reset link. Please try again.'
      };
    }
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Email verified successfully'
      };
    } catch {
      return {
        success: false,
        message: 'Invalid verification token'
      };
    }
  }
}

export default new AuthService();
