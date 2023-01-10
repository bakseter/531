package net.bakseter

import io.ktor.server.application.Application
import io.ktor.server.netty.EngineMain
import java.net.URI
import net.bakseter.plugins.configureCORS
import net.bakseter.plugins.configureContentNegotiation
import net.bakseter.plugins.configureDocs
import net.bakseter.plugins.configureRateLimit
import net.bakseter.plugins.configureRouting

fun main(args: Array<String>) {
    EngineMain.main(args)
}

fun Application.module() {
    val databaseUrl = URI(environment.config.property("ktor.databaseUrl").getString())

    DatabaseHandler(
        databaseUrl,
    ).init()

    configureCORS()
    configureContentNegotiation()
    configureRouting()
    // configureDocs()
    configureRateLimit()
}
