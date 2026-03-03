# Spark Management - Laravel

**Spark Management - Laravel** is a full-stack project management platform with a web frontend, backend logic, and APIs for mobile and desktop integration.

---

## File Permissions

When creating files or running commands, you may need to adjust file permissions:

```
sudo chown -R $(whoami):$(whoami) .
sudo chmod -R u+w .

sudo chown -R www-data:www-data .
sudo chmod -R 775 .

sudo chmod -R 755 storage
sudo chown -R www-data:www-data storage
```

⚠️ These commands ensure that both your user and the web server have proper access to the project files and storage directories.