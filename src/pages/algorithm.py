# # algorithm.py

# import gspread
# import pandas as pd
# from oauth2client.service_account import ServiceAccountCredentials
# import time  # (Optional) to simulate a delay between API calls

# # -----------------------------------------------------------------
# # 1. SET UP GOOGLE SHEETS API CREDENTIALS
# # -----------------------------------------------------------------
# # Define the scope required for Google Sheets and Google Drive access.
# scope = [
#     "https://spreadsheets.google.com/feeds",
#     "https://www.googleapis.com/auth/drive",
# ]

# # Authenticate using the downloaded JSON credentials file.
# # Make sure to replace "credentials.json" with the correct path if it’s in a dedicated folder.
# creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)

# # Authorize the client. This client now has permission to access your sheets.
# client = gspread.authorize(creds)

# # -----------------------------------------------------------------
# # 2. OPEN YOUR SURVEY SPREADSHEET
# # -----------------------------------------------------------------
# # Replace 'your_spreadsheet_id' with your actual Google Sheet ID.
# spreadsheet_id = "your_spreadsheet_id"  # e.g., "1a2B3c4D5e6F7..."
# spreadsheet = client.open_by_key(spreadsheet_id)

# # -----------------------------------------------------------------
# # 3. READ SURVEY RESPONSES FROM THE "Survey Responses" WORKSHEET
# # -----------------------------------------------------------------
# try:
#     survey_ws = spreadsheet.worksheet("Survey Responses")
# except gspread.exceptions.WorksheetNotFound:
#     raise Exception("Worksheet 'Survey Responses' not found. Please create it in your Google Sheet.")

# # Fetch all records from the worksheet as a list of dictionaries.
# survey_data = survey_ws.get_all_records()

# # Convert the list of dictionaries to a Pandas DataFrame for easier processing.
# df = pd.DataFrame(survey_data)

# # For debugging: print the first few rows
# print("Survey data imported successfully:")
# print(df.head())

# # Make sure row headers match exactly (case-sensitive) what's in your sheet.
# required_columns = ["Name", "Email", "Problem", "Cause", "TimePeriod", "Effect", "Description"]

# for col in required_columns:
#     if col not in df.columns:
#         raise Exception(f"Column '{col}' is missing from the survey data. Check your headers in the Survey Responses worksheet.")

# # -----------------------------------------------------------------
# # 4. PROCESS THE DATA: GROUP AND CLASSIFY
# # -----------------------------------------------------------------
# # In this example, we are grouping respondents by "Problem", "Cause", "TimePeriod", and "Effect".
# # You can adjust this logic to suit your needs.
# grouped = df.groupby(["Problem", "Cause", "TimePeriod", "Effect"])

# # Prepare an empty list to accumulate grouping results.
# groups_result = []

# # Loop through each group
# for group_key, group_df in grouped:
#     # The group_key is a tuple (Problem, Cause, TimePeriod, Effect)
#     group_name = f"{group_key[0]}_{group_key[1]}_{group_key[2]}_{group_key[3]}"
#     # Convert the dataframe group to a list of dictionaries
#     members = group_df.to_dict("records")
#     n_members = len(members)
    
#     # Split the group into sub-groups of 10 members each.
#     group_num = 1
#     for i in range(0, n_members, 10):
#         sub_members = members[i:i + 10]
#         # Create the grouping result record.
#         groups_result.append({
#             "GroupName": f"{group_name}_Group{group_num}",
#             "Problem": group_key[0],
#             "Cause": group_key[1],
#             "TimePeriod": group_key[2],
#             "Effect": group_key[3],
#             "MemberCount": len(sub_members),
#             "MemberEmails": ", ".join([member["Email"] for member in sub_members]),
#         })
#         group_num += 1

# # Convert the grouping result list to a DataFrame
# df_groups = pd.DataFrame(groups_result)

# print("Grouping results:")
# print(df_groups.head())

# # -----------------------------------------------------------------
# # 5. WRITE THE GROUPING RESULTS TO THE "Groups" WORKSHEET
# # -----------------------------------------------------------------
# # Try to open the worksheet called "Groups"; if it doesn't exist, create it.
# try:
#     groups_ws = spreadsheet.worksheet("Groups")
#     groups_ws.clear()  # Clear existing data if needed.
# except gspread.exceptions.WorksheetNotFound:
#     groups_ws = spreadsheet.add_worksheet(title="Groups", rows="100", cols="20")

# # Write the header row first.
# header = df_groups.columns.tolist()
# groups_ws.append_row(header)

# # Loop over each row and append it.
# # (Note: For performance, you might consider batch updates using gspread's batch_update function.)
# for index, row in df_groups.iterrows():
#     groups_ws.append_row(row.values.tolist())
#     time.sleep(0.2)  # Optional delay to prevent hitting API rate limits.

# print("Grouping complete. Check your 'Groups' worksheet for results.")
