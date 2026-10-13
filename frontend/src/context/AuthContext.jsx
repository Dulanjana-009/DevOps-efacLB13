import { createContext, useContext, useEffect, useState } from "react";
import { authApi, membersApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (currentUser) localStorage.setItem("currentUser", JSON.stringify(currentUser));
    else localStorage.removeItem("currentUser");
  }, [currentUser]);

  const refreshMembers = async (role = currentUser?.role) => {
    if (role !== "admin" && role !== "librarian") {
      setUsers(currentUser ? [currentUser] : []);
      return;
    }
    try {
      const members = await membersApi.list();
      setUsers(members);
    } catch (error) {
      console.error("Failed to load members:", error.message);
    }
  };

  useEffect(() => {
    if (currentUser) refreshMembers(currentUser.role);
    else setUsers([]);
  }, [currentUser?.id, currentUser?.role]);

  const login = async (username, password) => {
    try {
      const data = await authApi.login(username, password);
      localStorage.setItem("libraryToken", data.token);
      setCurrentUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("libraryToken");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setUsers([]);
  };

  const registerMember = async (memberData) => {
    try {
      await authApi.register(memberData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const createMember = async (memberData) => {
    try {
      const member = await membersApi.create(memberData);
      setUsers((current) => [member, ...current]);
      return { success: true, member };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateMember = async (memberId, memberData) => {
    try {
      const member = await membersApi.update(memberId, memberData);
      setUsers((current) => current.map((u) => u.id === memberId ? member : u));
      return { success: true, member };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteMemberAccount = async (memberId) => {
    try {
      await membersApi.remove(memberId);
      setUsers((current) => current.filter((u) => u.id !== memberId));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateOwnProfile = async (profileData) => {
    try {
      const data = await authApi.updateProfile(profileData);
      setCurrentUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const changePassword = async (data) => {
    try {
      await authApi.changePassword(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return <AuthContext.Provider value={{
    users, currentUser, login, logout, registerMember, createMember,
    updateMember, deleteMemberAccount, updateOwnProfile, changePassword,
    refreshMembers,
  }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
