const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Active" });
};

module.exports = {
  activeCheck,
};
