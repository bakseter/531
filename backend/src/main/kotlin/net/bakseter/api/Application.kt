package net.bakseter.api

import io.ktor.server.application.Application
import io.ktor.server.netty.EngineMain
import net.bakseter.api.plugins.configureAuthentication
import net.bakseter.api.plugins.configureCORS
import net.bakseter.api.plugins.configureContentNegotiation
import net.bakseter.api.plugins.configureRateLimit
import net.bakseter.api.plugins.configureRouting
import java.net.URI

fun main(args: Array<String>) {
    EngineMain.main(args)
}

fun Application.module() {
    val databaseUrl = URI(environment.config.property("ktor.databaseUrl").getString())
    val adminKey = environment.config.property("ktor.adminKey").getString()
    val migrateDb = environment.config.property("ktor.migrateDb").getString().toBooleanStrict()

    DatabaseHandler(
        migrateDb,
        databaseUrl,
    ).init()

    configureAuthentication(adminKey)
    configureCORS()
    configureContentNegotiation()
    configureRouting()
    // configureDocumentation()
    configureRateLimit()
}
