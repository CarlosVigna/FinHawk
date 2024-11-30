import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestConnection {
    public static void main(String[] args) {
        // Configurações do SQL Server
        String url = "jdbc:sqlserver://localhost:1433;databaseName=Finances";
        String user = "sa";
        String password = "W6uvozax@@";

        try (Connection connection = DriverManager.getConnection(url, user, password)) {
            if (connection != null) {
                System.out.println("Conexão com SQL Server bem-sucedida!");
            }
        } catch (SQLException e) {
            System.out.println("Erro ao conectar com o SQL Server: " + e.getMessage());
        }
    }
}