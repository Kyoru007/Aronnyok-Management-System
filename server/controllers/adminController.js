import db from '../db'; // Import your database connection or ORM

// Controller function to delete a university
export const deleteUniversity = async (req, res) => {
    const { universityId } = req.params;

    try {
        // Your logic to delete a university
        await db.query('DELETE FROM universities WHERE id = ?', [universityId]);
        res.json({ Status: true });
    } catch (error) {
        console.error("Error deleting university:", error);
        res.status(500).json({ Status: false, Error: 'Failed to delete university' });
    }
};

// Controller function to delete a discipline
export const deleteDiscipline = async (req, res) => {
    const { disciplineId } = req.params;

    try {
        // Your logic to delete a discipline
        await db.query('DELETE FROM disciplines WHERE id = ?', [disciplineId]);
        res.json({ Status: true });
    } catch (error) {
        console.error("Error deleting discipline:", error);
        res.status(500).json({ Status: false, Error: 'Failed to delete discipline' });
    }
};
