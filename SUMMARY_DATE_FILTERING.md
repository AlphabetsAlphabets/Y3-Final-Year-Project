# Summary Page Date Filtering

## Overview

The enhanced Summary page now includes comprehensive date filtering capabilities that allow users to analyze their time tracking data within specific date ranges. This feature provides both manual date selection and quick preset options for common time periods.

## Features

### Date Range Selection
- **From Date**: Select a start date to filter logs from that date onwards
- **To Date**: Select an end date to filter logs up to that date
- **Flexible Filtering**: Use either date independently or both together
- **Clear Function**: Easily reset filters to view all data

### Quick Preset Buttons
- **Today**: View today's activity only
- **Yesterday**: View yesterday's activity
- **This Week**: View current week (Sunday to today)
- **Last Week**: View the previous complete week
- **This Month**: View current month (1st to today)
- **Last Month**: View the previous complete month

### Dynamic Statistics
The summary statistics update automatically based on your selected date range:
- **Total Hours**: Sum of all logged time in the filtered period
- **Sessions**: Number of individual time tracking sessions
- **Average Session**: Average duration per session
- **Date Range**: Actual date span of the filtered data

### Responsive Chart Updates
- Pie charts automatically update to reflect filtered data
- Chart titles include the selected date range for clarity
- Data switches seamlessly between Activity and Project views

## How to Use

### Manual Date Selection
1. Navigate to the Summary page
2. Use the "From" and "To" date inputs to select your desired range
3. The chart and statistics will update automatically
4. Click "Clear Dates" to return to viewing all data

### Quick Presets
1. Click any of the preset buttons (Today, Yesterday, This Week, etc.)
2. The date inputs will be automatically filled
3. Data will filter immediately to show the selected period

### View Switching
- Use the "View by" dropdown to switch between Activity and Project breakdowns
- The filtering remains active when switching views
- Chart titles update to reflect both the view type and date range

## Data Display

### When Data Exists
- Summary statistics cards show key metrics
- Interactive pie chart displays time distribution
- Chart includes date range in the title

### When No Data Found
- Clear message indicating no data for the selected range
- Helpful suggestions to adjust filters or start logging
- Different messages for filtered vs. unfiltered views

## Technical Details

### Date Handling
- Dates are converted to Unix timestamps for precise filtering
- End dates include the full day (until 23:59:59)
- All timezone handling respects the user's local timezone

### Performance
- Filtering happens client-side for instant updates
- Original data is preserved while working with filtered subsets
- Efficient re-computation of statistics and chart data

## Tips for Best Results

1. **Regular Logging**: Consistent time tracking provides more meaningful summaries
2. **Use Presets**: Quick preset buttons are faster than manual date entry
3. **Compare Periods**: Use different date ranges to compare productivity across time periods
4. **Check Date Range**: The "Date Range" statistic shows the actual span of your data
5. **Clear When Needed**: Use "Clear Dates" to return to the full dataset overview

## Future Enhancements

Potential improvements planned for future versions:
- Custom date range presets
- Export functionality for filtered data
- Comparison views between different date ranges
- More granular time filtering (hourly, daily breakdowns)
- Integration with calendar view for seamless navigation