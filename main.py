import time

class TimeSpan:
    def __init__(self, seconds):
        self.seconds = seconds

class Task:
    def __init__(self, name, project, tag):
        self.name = name
        self.project = project
        self.tag = tag
        self.time = TimeSpan(0)

    def add_time(self, elapsed):
        self.time = TimeSpan(elapsed)

start = time.time()
time.sleep(5)
end = time.time()

elapsed = end - start
task = Task("Making classes", "FYP", "Work")
task.add_time(elapsed)

print(f"You spent {task.time.seconds} on {task.name}")
