const TrackingLog = require('../models/TrackingLog');
const Medicine = require('../models/Medicine');

// GET today's tracking logs
const getTodayLogs = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // "2024-01-15"

    // Today's logs fetch pannudu
    let logs = await TrackingLog.find({
      userId: req.user.userId,
      date: today,
    });

    // If no logs — auto generate from medicines
    if (logs.length === 0) {
      const medicines = await Medicine.find({
        userId: req.user.userId,
        isActive: true,
      });

      // Each medicine's each time-ku log create pannudu
      const logsToCreate = [];
      medicines.forEach((medicine) => {
        medicine.times.forEach((time) => {
          logsToCreate.push({
            userId: req.user.userId,
            medicineId: medicine._id,
            medicineName: medicine.name,
            dosage: medicine.dosage,
            scheduledTime: time,
            date: today,
            status: 'pending',
          });
        });
      });

      if (logsToCreate.length > 0) {
        logs = await TrackingLog.insertMany(logsToCreate, {
          ordered: false // Duplicate-a irundha skip pannudu, error agadu
        });
      }
    }

    // Time order-la sort pannudu
    logs.sort((a, b) =>
      a.scheduledTime.localeCompare(b.scheduledTime)
    );

    res.status(200).json(logs);

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching logs',
      error: error.message
    });
  }
};

// PATCH — Mark as taken or missed
const updateLogStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const log = await TrackingLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    // Security check
    if (log.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    log.status = status;
    if (status === 'taken') {
      log.takenAt = new Date();
    }
    await log.save();

    res.status(200).json({ message: 'Updated', log });

  } catch (error) {
    res.status(500).json({ message: 'Error updating log' });
  }
};

// GET weekly stats
const getWeeklyStats = async (req, res) => {
  try {
    // Last 7 days dates array
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const logs = await TrackingLog.find({
      userId: req.user.userId,
      date: { $in: dates },
    });

    // Each day stats calculate pannudu
    const stats = dates.map((date) => {
      const dayLogs = logs.filter((l) => l.date === date);
      const taken = dayLogs.filter((l) => l.status === 'taken').length;
      const total = dayLogs.length;

      return {
        date,
        day: new Date(date).toLocaleDateString('en-US', {
          weekday: 'short'
        }),
        taken,
        missed: dayLogs.filter((l) => l.status === 'missed').length,
        pending: dayLogs.filter((l) => l.status === 'pending').length,
        total,
        percentage: total > 0 ? Math.round((taken / total) * 100) : 0,
      };
    });

    res.status(200).json(stats);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

module.exports = { getTodayLogs, updateLogStatus, getWeeklyStats };