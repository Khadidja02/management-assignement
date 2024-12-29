# backend/Dockerfile
FROM python:3.11.4

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY ./backend/dashboard/requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code into the container
COPY ./backend/dashboard /app/

# Set the environment variables
ENV PYTHONUNBUFFERED=1

# Expose port 8000 for the Django app
EXPOSE 8000

# Run the Django application (adjust with your command if needed)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
