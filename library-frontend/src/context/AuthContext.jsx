import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const defaultUsers = [
  {
    id: "A001",
    name: "System Admin",
    username: "admin",
    password: "admin123",
    role: "admin",
    email: "admin@library.com",
    phone: "",
  },
  {
    id: "L001",
    name: "Library Staff",
    username: "librarian",
    password: "lib123",
    role: "librarian",
    email: "librarian@library.com",
    phone: "",
  },
  {
    id: "M001",
    name: "Demo Member",
    username: "member",
    password: "member123",
    role: "member",
    email: "member@example.com",
    phone: "0712345678",
  },
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("libraryUsers");

    return saved
      ? JSON.parse(saved)
      : defaultUsers;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");

    return saved
      ? JSON.parse(saved)
      : null;
  });

  const [lastMemberNumber, setLastMemberNumber] =
    useState(() => {
      const saved =
        localStorage.getItem("lastMemberNumber");

      if (saved) {
        return Number(saved);
      }

      const memberNumbers = defaultUsers
        .filter((user) => user.role === "member")
        .map((user) =>
          Number(user.id.replace("M", ""))
        );

      return memberNumbers.length
        ? Math.max(...memberNumbers)
        : 0;
    });

  useEffect(() => {
    localStorage.setItem(
      "libraryUsers",
      JSON.stringify(users)
    );
  }, [users]);

  useEffect(() => {
    localStorage.setItem(
      "lastMemberNumber",
      String(lastMemberNumber)
    );
  }, [lastMemberNumber]);

  useEffect(() => {
  if (currentUser) {
    localStorage.setItem(
      "currentUser",
      JSON.stringify(currentUser)
    );
  } else {
    localStorage.removeItem("currentUser");
  }
}, [currentUser]);

  const login = (username, password) => {
    const user = users.find(
      (item) =>
        item.username.toLowerCase() ===
          username.trim().toLowerCase() &&
        item.password === password
    );

    if (!user) {
      return false;
    }

    setCurrentUser(user);

    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const usernameExists = (
    username,
    excludeId = null
  ) => {
    return users.some(
      (user) =>
        user.username.toLowerCase() ===
          username.trim().toLowerCase() &&
        user.id !== excludeId
    );
  };

  const emailExists = (
    email,
    excludeId = null
  ) => {
    return users.some(
      (user) =>
        user.role === "member" &&
        user.email.toLowerCase() ===
          email.trim().toLowerCase() &&
        user.id !== excludeId
    );
  };

  const createMember = (memberData) => {
    if (
      usernameExists(memberData.username)
    ) {
      return {
        success: false,
        message:
          "This username is already in use.",
      };
    }

    if (emailExists(memberData.email)) {
      return {
        success: false,
        message:
          "A member with this email already exists.",
      };
    }

    const nextNumber =
      lastMemberNumber + 1;

    const memberId =
      `M${String(nextNumber).padStart(3, "0")}`;

    const newMember = {
      id: memberId,
      name: memberData.name.trim(),
      email: memberData.email.trim(),
      phone: memberData.phone.trim(),
      username: memberData.username.trim(),
      password: memberData.password,
      role: "member",
      status: "Active",
    };

    setUsers((current) => [
      ...current,
      newMember,
    ]);

    setLastMemberNumber(nextNumber);

    return {
      success: true,
      member: newMember,
    };
  };

  const registerMember = (memberData) => {
    return createMember(memberData);
  };

  const updateMember = (
    memberId,
    memberData
  ) => {
    const member = users.find(
      (user) =>
        user.id === memberId &&
        user.role === "member"
    );

    if (!member) {
      return {
        success: false,
        message: "Member not found.",
      };
    }

    if (
      usernameExists(
        memberData.username,
        memberId
      )
    ) {
      return {
        success: false,
        message:
          "This username is already in use.",
      };
    }

    if (
      emailExists(
        memberData.email,
        memberId
      )
    ) {
      return {
        success: false,
        message:
          "Another member already uses this email.",
      };
    }

    const updatedMember = {
      ...member,
      name: memberData.name.trim(),
      email: memberData.email.trim(),
      phone: memberData.phone.trim(),
      username: memberData.username.trim(),

      password:
        memberData.password?.trim()
          ? memberData.password
          : member.password,
    };

    setUsers((current) =>
      current.map((user) =>
        user.id === memberId
          ? updatedMember
          : user
      )
    );

    if (currentUser?.id === memberId) {
      setCurrentUser(updatedMember);

      localStorage.setItem(
        "currentUser",
        JSON.stringify(updatedMember)
      );
    }

    return {
      success: true,
      member: updatedMember,
    };
  };

  const deleteMemberAccount = (memberId) => {
    const member = users.find(
      (user) =>
        user.id === memberId &&
        user.role === "member"
    );

    if (!member) {
      return {
        success: false,
        message: "Member not found.",
      };
    }

    setUsers((current) =>
      current.filter(
        (user) => user.id !== memberId
      )
    );

    return {
      success: true,
    };
  };
  const updateOwnProfile = (profileData) => {
  if (!currentUser) {
    return {
      success: false,
      message: "No user is currently logged in.",
    };
  }

  if (
    usernameExists(
      profileData.username,
      currentUser.id
    )
  ) {
    return {
      success: false,
      message: "This username is already in use.",
    };
  }

  if (
    currentUser.role === "member" &&
    emailExists(
      profileData.email,
      currentUser.id
    )
  ) {
    return {
      success: false,
      message: "This email is already in use.",
    };
  }

  const updatedUser = {
    ...currentUser,
    name: profileData.name.trim(),
    email: profileData.email.trim(),
    phone: profileData.phone.trim(),
    username: profileData.username.trim(),
  };

  setUsers((current) =>
    current.map((user) =>
      user.id === currentUser.id
        ? updatedUser
        : user
    )
  );

  setCurrentUser(updatedUser);

  localStorage.setItem(
    "currentUser",
    JSON.stringify(updatedUser)
  );

  return {
    success: true,
    user: updatedUser,
  };
};

const changePassword = ({
  currentPassword,
  newPassword,
}) => {
  if (!currentUser) {
    return {
      success: false,
      message: "No user is logged in.",
    };
  }

  if (
    currentUser.password !== currentPassword
  ) {
    return {
      success: false,
      message: "Current password is incorrect.",
    };
  }

  if (newPassword.length < 6) {
    return {
      success: false,
      message:
        "New password must contain at least 6 characters.",
    };
  }

  if (newPassword === currentPassword) {
    return {
      success: false,
      message:
        "New password must be different from the current password.",
    };
  }

  const updatedUser = {
    ...currentUser,
    password: newPassword,
  };

  setUsers((current) =>
    current.map((user) =>
      user.id === currentUser.id
        ? updatedUser
        : user
    )
  );

  setCurrentUser(updatedUser);

  localStorage.setItem(
    "currentUser",
    JSON.stringify(updatedUser)
  );

  return {
    success: true,
  };
};

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,

        login,
        logout,

        createMember,
        registerMember,
        updateMember,
        deleteMemberAccount,

        usernameExists,
        emailExists,

        updateOwnProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}