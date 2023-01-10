package net.bakseter

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.transactions.transaction
import java.net.URI
import net.bakseter.schema.BaseWeights
import net.bakseter.schema.Workout

val tables: Array<Table> = arrayOf(
    Workout,
    BaseWeights,
)

class DatabaseHandler(
    dbUrl: URI,
) {
    private val dbPort = if (dbUrl.port == -1) 5432 else dbUrl.port
    private val dbUrlStr = "jdbc:postgresql://${dbUrl.host}:${dbPort}${dbUrl.path}"
    private val dbUsername = dbUrl.userInfo.split(":")[0]
    private val dbPassword = dbUrl.userInfo.split(":")[1]

    private fun dataSource(): HikariDataSource {
        return HikariDataSource(
            HikariConfig().apply {
                jdbcUrl = dbUrlStr
                username = dbUsername
                password = dbPassword
                driverClassName = "org.postgresql.Driver"
                connectionTimeout = 1000
                maximumPoolSize = 10
            }
        )
    }

    private val conn by lazy {
        Database.connect(dataSource())
    }

    fun init(insertTestData: Boolean = true) {
        // Need to use connection once to open.
        transaction(conn) {}

        try {
            transaction { SchemaUtils.create(*tables) }
        } catch (e: Exception) {
            System.err.println("Error creating tables, assuming they already exists.")
        }
    }
}
