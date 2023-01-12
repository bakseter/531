package net.bakseter.api

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.flywaydb.core.Flyway
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.batchInsert
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.joda.time.DateTime
import java.net.URI
import net.bakseter.api.schema.BaseWeights
import net.bakseter.api.schema.Joker
import net.bakseter.api.schema.Workout

val tables: Array<Table> = arrayOf(
    Workout,
    BaseWeights,
    Joker,
)

class DatabaseHandler(
    private val migrateDb: Boolean,
    dbUrl: URI,
) {
    private val dbPort = if (dbUrl.port == -1) 5432 else dbUrl.port
    private val dbUrlStr = "jdbc:postgresql://${dbUrl.host}:${dbPort}${dbUrl.path}"
    private val dbUsername = dbUrl.userInfo.split(":")[0]
    private val dbPassword = dbUrl.userInfo.split(":")[1]
    private val maxPoolSize = 7

    private fun dataSource(): HikariDataSource {
        return HikariDataSource(
            HikariConfig().apply {
                jdbcUrl = dbUrlStr
                username = dbUsername
                password = dbPassword
                driverClassName = "org.postgresql.Driver"
                connectionTimeout = 1000
                maximumPoolSize = maxPoolSize
            }
        )
    }

    private val flyway: Flyway =
        Flyway.configure().baselineOnMigrate(true).baselineVersion("2").cleanDisabled(false)
            .dataSource(dbUrlStr, dbUsername, dbPassword).load()

    private val conn by lazy {
        Database.connect(dataSource())
    }

    fun init(insertTestData: Boolean = true) {
        // Need to use connection once to open.
        transaction(conn) {}

        if (migrateDb) {
            flyway.migrate()
            return
        }

        try {
            transaction { SchemaUtils.create(*tables) }
        } catch (e: Exception) {
            System.err.println("Error creating tables, assuming they already exists.")
        }

        flyway.baseline()
        // Try to migrate as well to confirm we are good.
        flyway.migrate()
    }
}
