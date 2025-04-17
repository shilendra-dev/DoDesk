import { createContext, useEffect, useState , useContext} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

function AuthProvider({children}){
    const [user, setUser] = useState(null);

    //function for login
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("token", userData.token);
        localStorage.setItem("id", userData.id);
        
    };

    //function for logout
    const logout = (userData) => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("id");
    };

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const restoreUser = async () => {
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const { data } = await axios.get("http://localhost:5033/api/auth/me", {
                headers: { Authorization: token },
              });
              setUser(data);
            } catch (err) {
              console.error("Auth restore error:", err);
              setUser(null);
            }
          }
          setLoading(false); // done loading regardless of result
        };
      
        restoreUser();
      }, []);

    return (
        <AuthContext.Provider value = {{user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
}

 //shortcut to use useContext(AuthContext)
function useAuth(){
    return useContext(AuthContext);

}
export {AuthProvider, useAuth};
