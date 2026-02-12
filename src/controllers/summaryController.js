const Scan = require('../models/Scan');

// function to calculate daily summary
exports.getDailySummary = async (req, res) => {
    try {
        const userId = req.user._id;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // day starts at 12 am
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);// ends at 12 am too haha

        // fetching all the scans from today
        const scans = await Scan.find({
            user: userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        // calculating total gst for today
        const totalGstToday = scans.reduce((sum, scan) => sum + scan.totalGstAmount, 0);

        // User's actual stats
        const { monthlyIncome, workDaysPerMonth, workHoursPerDay } = req.user;
        const dailyIncome = monthlyIncome / workDaysPerMonth;
        const hourlyRate = dailyIncome / workHoursPerDay;
        const hoursWorkedForTax = hourlyRate > 0 ? (totalGstToday / hourlyRate) : 0;

        // --- PHASE 8: Comparison Scenarios --- // to show user even if they have not added the salary yet
        const slabs = [30000, 60000, 100000, 200000];
        const comparisons = slabs.map(slab => {
            const sDaily = slab / workDaysPerMonth;
            const sHourly = sDaily / workHoursPerDay;
            const sHours = sHourly > 0 ? (totalGstToday / sHourly) : 0;
            return {
                incomeBracket: slab,
                workMinutes: (sHours * 60).toFixed(0)
            };
        });

        res.status(200).json({
            success: true,
            summary: {
                totalGstToday: totalGstToday.toFixed(2),
                userStats: {
                    monthlyIncome,
                    hoursWorked: hoursWorkedForTax.toFixed(2),
                    minutesWorked: (hoursWorkedForTax * 60).toFixed(0)
                },
                comparisons // The new scenario data
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get monthly tax summary
// @route   GET /api/summary/monthly
exports.getMonthlySummary = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Define start of the current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 1. Find all scans for the current month
        const scans = await Scan.find({
            user: userId,
            date: { $gte: startOfMonth }
        });

        // 2. Aggregate Totals
        const totalGstMonth = scans.reduce((sum, scan) => sum + scan.totalGstAmount, 0);
        const totalSpentMonth = scans.reduce((sum, scan) => sum + (scan.pricePaid * scan.quantity), 0);

        // 3. Income Logic
        const { monthlyIncome, workDaysPerMonth } = req.user;
        const dailyIncome = monthlyIncome / workDaysPerMonth;

        // 4. Calculate Work Days Equivalence
        // Total GST / Daily Income = How many full work days spent on tax
        const workDaysForTax = dailyIncome > 0 ? (totalGstMonth / dailyIncome) : 0;




        res.status(200).json({
            success: true,
            summary: {
                month: now.toLocaleString('default', { month: 'long' }),
                totalItemsScanned: scans.length,
                totalSpent: totalSpentMonth.toFixed(2),
                totalGstMonth: totalGstMonth.toFixed(2),
                workDaysForTax: workDaysForTax.toFixed(2),
                taxPercentageOfIncome: ((totalGstMonth / monthlyIncome) * 100).toFixed(2) + '%'
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};