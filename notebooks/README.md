# Analysis Notebooks

This folder contains Jupyter notebooks for data analysis and visualization.

## `visualisation.ipynb`

A comprehensive analysis notebook for the Tunisia medical professionals dataset.

### Contents

1. **Data Loading & Preprocessing**
   - Import libraries (pandas, matplotlib, seaborn, folium)
   - Load CSV data
   - Clean specialty names
   - Extract governorate estimates
   - Filter invalid coordinates

2. **Visualizations**
   - **Top 10 Specialties** - Bar chart showing most common medical fields
   - **Regional Distribution** - Bar chart of doctors by governorate
   - **Interactive Map** - Folium map with all doctor locations
   - **Specialty Distribution** - Pie chart of top 8 specialties vs others
   - **Governorate Availability** - Analysis of Unknown vs Known locations

3. **Statistics**
   - Total doctor count
   - Unique specialties count
   - Most common specialty
   - Geographic coverage analysis

### Requirements

```bash
pip install pandas matplotlib seaborn folium
```

Or install from the first cell in the notebook:
```python
%pip install pandas matplotlib seaborn folium
```

### Generated Outputs

The notebook generates the following files in the same directory:

- `top_specialties.png` - Bar chart of top 10 specialties
- `doctors_by_region.png` - Bar chart of regional distribution
- `specialty_distribution_pie.png` - Pie chart of specialty distribution
- `governorate_unknown_pie.png` - Analysis of location data quality
- `doctors_map.html` - Interactive HTML map (open in browser)
- `processed_doctors_data.csv` - Cleaned and processed dataset

### How to Use

1. Open in Jupyter Notebook or JupyterLab:
   ```bash
   jupyter notebook visualisation.ipynb
   ```

2. Or use VS Code with Jupyter extension

3. Run cells sequentially from top to bottom

4. View generated visualizations inline and as saved files

### Key Insights from Analysis

- **4,320 total doctors** in the dataset
- **48 unique specialties** represented
- **Tunis governorate** has the highest concentration
- Geographic coordinates cover all of Tunisia
- Most doctors are located in urban centers

### Customization

Modify the notebook to:
- Add new visualization types
- Change color schemes
- Filter by specific governorates or specialties
- Export to different formats
- Add statistical tests
- Create custom maps with different base layers

---

For questions about the analysis, please refer to the notebook cells which include detailed comments and markdown explanations.
