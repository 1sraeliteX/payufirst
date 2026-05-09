# PayFirst - Comprehensive Budget Tracker

A modern, feature-rich budget tracking application built with React that helps users manage their finances with intelligent categorization, item-level budgeting, and multi-currency support.

## 🚀 Features

### 💰 Budget Management
- **Custom Budget Amounts**: Set your total budget with flexible time periods (weekly, bi-weekly, monthly, yearly)
- **Category Allocation**: Divide your budget across customizable categories with percentage-based allocation
- **Real-time Calculations**: Automatic calculation of allocated amounts and remaining budgets

### 📊 Category System
- **Dynamic Categories**: Add, edit, and delete custom categories with unique names
- **Icon Selection**: Choose from 30+ icons to visually represent your categories
- **Color Coding**: 15 color options to personalize your budget visualization
- **Percentage Management**: Smart validation ensures categories total exactly 100%

### 📝 Item-Level Budgeting
- **Detailed Items**: Create specific budget items within each category (e.g., "Rent: $1200", "Utilities: $150")
- **Allocation Tracking**: Assign specific amounts to each item and track remaining allocations
- **Spent vs Allocated**: Clear distinction between planned amounts and actual spending
- **Progress Visualization**: Individual progress bars for each item showing spending status

### 💳 Multi-Currency Support
- **6 Currencies**: USD ($), EUR (€), GBP (£), CAD (C$), AUD (A$), NGN (₦)
- **Smart Formatting**: Automatic currency symbol positioning based on currency standards
- **Persistent Preferences**: Selected currency remembered across sessions
- **Real-time Switching**: Instant currency conversion across all displays

### 📈 Visual Analytics
- **Interactive Pie Charts**: Visual breakdown of budget allocation by category
- **Color-Coded Legend**: Clear category identification with icons and colors
- **Progress Indicators**: Color-coded spending status (green/yellow/red)
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 💾 Data Management
- **Automatic Saving**: All changes instantly saved to browser storage
- **Expense Tracking**: Record and categorize expenses with optional item linking
- **Data Persistence**: Complete data retention across browser sessions
- **Export Ready**: All data structured for easy export and backup

## 🛠️ Technical Stack

- **Frontend**: React 18.2.0 with modern hooks and state management
- **Styling**: TailwindCSS for responsive, utility-first design
- **Icons**: Lucide React icons for consistent, modern iconography
- **Charts**: Recharts library for interactive data visualization
- **Build**: Create React App with optimized production builds

## 📱 User Experience

- **Intuitive Interface**: Clean, modern design with logical flow
- **Real-time Updates**: Instant visual feedback for all user actions
- **Error Prevention**: Smart validation prevents invalid inputs and data conflicts
- **Confirmation Dialogs**: Safe deletion with clear warnings
- **Responsive Layout**: Mobile-friendly design that adapts to screen size

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ recommended
- npm or yarn package manager

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/1sraeliteX/payufirst.git
   cd payfirst
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the Application**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### Setting Up Your Budget
1. **Set Total Budget**: Enter your income/budget amount and select time period
2. **Configure Categories**: 
   - Use default categories or create custom ones
   - Adjust percentages to total 100%
   - Choose icons and colors for visual organization
3. **Add Budget Items**:
   - Expand categories to add specific expense items
   - Set allocated amounts for each item
   - Track remaining allocation within categories

### Tracking Expenses
1. **Record Expenses**: Add expenses with descriptions and amounts
2. **Link to Items**: Optionally link expenses to specific budget items
3. **Monitor Progress**: View real-time spending against allocations
4. **Visual Insights**: Check charts and progress indicators

### Currency Management
1. **Select Currency**: Use dropdown in header to switch currencies
2. **Automatic Formatting**: All amounts display with correct symbols
3. **Persistent Settings**: Currency preference saved automatically

## 🎯 Key Features Explained

### Smart Category Management
- **Percentage Validation**: Prevents over-allocation with real-time feedback
- **Visual Feedback**: Color-coded progress bars and status indicators
- **Flexible Organization**: Create categories that match your financial life

### Item-Level Precision
- **Granular Control**: Budget down to specific expense items
- **Allocation Tracking**: See exactly how much budget remains unallocated
- **Spent Analysis**: Track actual spending against planned amounts

### Multi-Currency Flexibility
- **Global Ready**: Support for international currencies
- **Smart Formatting**: Automatic symbol positioning and formatting
- **Instant Switching**: Change currency without losing data

## 🔧 Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Project Structure
```
payfirst/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main application component
│   ├── index.css        # Styling with TailwindCSS
│   └── index.js        # Application entry point
├── package.json         # Dependencies and scripts
└── README.md           # This documentation
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Your Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow React best practices and hooks patterns
- Use TailwindCSS for styling consistency
- Maintain responsive design principles
- Test across different screen sizes
- Write clear, descriptive commit messages

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋 Support

For questions, issues, or feature requests:
- **GitHub Issues**: [Create an issue](https://github.com/1sraeliteX/payufirst/issues)
- **Discussions**: [Start a discussion](https://github.com/1sraeliteX/payufirst/discussions)

## 🌟 Acknowledgments

Built with modern web technologies and designed for intuitive financial management. Special thanks to the open-source community for the tools and libraries that make this project possible.

---

**PayFirst** - Take control of your finances with intelligent budgeting.
