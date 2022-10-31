import User from "../models/user";

const userCheck = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      errorThrow(401, `User of id:${userId} does not exists.`);
    }
    return user!;
  } catch (err) {
    throw err;
  }
};

export default userCheck;
